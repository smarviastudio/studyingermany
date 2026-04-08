import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Daily limits by subscription tier
const DAILY_LIMITS: Record<string, number> = {
  free: 5,
  starter: 10,
  essential: 20,
  pro: 50,
};

async function getUserDailyMessageCount(userId: string): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Count messages where role is 'user' by checking content pattern
  // Since we're migrating schema, we'll use raw query or filter in memory
  const messages = await prisma.chatMessage.findMany({
    where: {
      userId,
      createdAt: {
        gte: today,
      },
    },
    select: { role: true },
  });
  
  return messages.filter(m => m.role === 'user').length;
}

async function getUserSubscriptionTier(userId: string): Promise<string> {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: { in: ['active', 'trialing'] },
    },
    orderBy: { createdAt: 'desc' },
  });
  
  if (!subscription) return 'free';
  
  const planType = subscription.planType?.toLowerCase() || '';
  if (planType.includes('pro')) return 'pro';
  if (planType.includes('essential')) return 'essential';
  if (planType.includes('starter')) return 'starter';
  
  return 'free';
}

async function saveMessage(userId: string, role: 'user' | 'assistant', content: string, context?: any) {
  await prisma.chatMessage.create({
    data: {
      userId,
      role,
      content,
      context: context ? JSON.stringify(context) : null,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({
        error: 'Authentication required',
        requiresAuth: true,
      }, { status: 401 });
    }
    
    const userId = session.user.id as string;
    const body = await request.json();
    const { message, context, conversationHistory } = body;
    
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    
    // Check subscription and daily limit
    const tier = await getUserSubscriptionTier(userId);
    const dailyLimit = DAILY_LIMITS[tier] || 5;
    const messageCount = await getUserDailyMessageCount(userId);
    
    if (messageCount >= dailyLimit) {
      return NextResponse.json({
        error: 'Daily limit reached',
        limitReached: true,
        tier,
        dailyLimit,
        remainingMessages: 0,
        message: `You've reached your daily limit of ${dailyLimit} messages. ${tier === 'free' ? 'Upgrade to get more messages!' : 'Your limit resets at midnight.'}`,
      }, { status: 429 });
    }
    
    // Save user message
    await saveMessage(userId, 'user', message.trim(), context);
    
    // Build system prompt based on context
    let systemPrompt = `You are a helpful AI assistant for German Path, a platform helping international students study in Germany. 
You help with:
- Finding university programs in Germany
- Understanding visa requirements
- Application processes
- Living costs and blocked accounts
- German language requirements
- Scholarship opportunities

Be concise, helpful, and friendly. Use markdown formatting for better readability.
If you don't know something specific, suggest the user check official sources or contact the university directly.`;

    // Add context if available
    if (context) {
      if (context.type === 'program' && context.data) {
        systemPrompt += `\n\nThe user is currently viewing this program:
- Program: ${context.data.name || 'Unknown'}
- University: ${context.data.university || 'Unknown'}
- Degree: ${context.data.degree || 'Unknown'}
- Language: ${context.data.language || 'Unknown'}
- Duration: ${context.data.duration || 'Unknown'}
- Tuition: ${context.data.tuition || 'Unknown'}
- Description: ${context.data.description || 'No description available'}

Answer questions specifically about this program when relevant.`;
      } else if (context.type === 'blog' && context.data) {
        systemPrompt += `\n\nThe user is currently reading this article:
- Title: ${context.data.title || 'Unknown'}
- Content Summary: ${context.data.content?.substring(0, 1500) || 'No content available'}

Answer questions based on this article content when relevant.`;
      } else if (context.type === 'page') {
        systemPrompt += `\n\nThe user is currently on the ${context.pageName || 'website'} page.`;
      }
    }

    // Build messages array
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
    ];
    
    // Add conversation history (last 10 messages)
    if (conversationHistory && Array.isArray(conversationHistory)) {
      const recentHistory = conversationHistory.slice(-10);
      for (const msg of recentHistory) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({ role: msg.role, content: msg.content });
        }
      }
    }
    
    // Add current message
    messages.push({ role: 'user', content: message.trim() });
    
    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 800,
      temperature: 0.7,
    });
    
    const reply = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    
    // Save assistant message
    await saveMessage(userId, 'assistant', reply);
    
    const remainingMessages = dailyLimit - messageCount - 1;
    
    return NextResponse.json({
      reply,
      tier,
      dailyLimit,
      remainingMessages: Math.max(0, remainingMessages),
      messageCount: messageCount + 1,
    });
    
  } catch (error) {
    console.error('[Global Chat API] Error:', error);
    return NextResponse.json({
      error: 'Failed to process message',
    }, { status: 500 });
  }
}

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({
        authenticated: false,
        requiresAuth: true,
      });
    }
    
    const userId = session.user.id as string;
    const tier = await getUserSubscriptionTier(userId);
    const dailyLimit = DAILY_LIMITS[tier] || 5;
    const messageCount = await getUserDailyMessageCount(userId);
    
    return NextResponse.json({
      authenticated: true,
      tier,
      dailyLimit,
      remainingMessages: Math.max(0, dailyLimit - messageCount),
      messageCount,
    });
    
  } catch (error) {
    console.error('[Global Chat API] GET Error:', error);
    return NextResponse.json({
      error: 'Failed to get chat status',
    }, { status: 500 });
  }
}
