import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'openai/gpt-4o-mini';

// Daily limits by subscription tier
const DAILY_LIMITS: Record<string, number> = {
  free: 5,
  starter: 10,
  essential: 20,
  pro: 50,
};

async function getUserDailyMessageCount(userId: string): Promise<number> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Try to count messages with the new schema (role field)
    const messages = await prisma.chatMessage.findMany({
      where: {
        userId,
        createdAt: {
          gte: today,
        },
      },
    });
    
    // Filter for user messages - handle both old and new schema
    return messages.filter((m: Record<string, unknown>) => m.role === 'user').length;
  } catch (error) {
    console.error('[Global Chat] Failed to get message count:', error);
    // Return 0 on error to allow chat to work
    return 0;
  }
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

async function saveMessage(userId: string, role: 'user' | 'assistant', content: string, context?: Record<string, unknown>) {
  try {
    await prisma.chatMessage.create({
      data: {
        userId,
        role,
        content,
        context: context ? JSON.stringify(context) : null,
      },
    });
  } catch (error) {
    // Log but don't fail - message saving is non-critical
    console.error('[Global Chat] Failed to save message:', error);
  }
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
    if (context && context.data) {
      const { title, content } = context.data;
      
      if (context.type === 'blog' && (title || content)) {
        systemPrompt += `\n\nThe user is currently reading this article:
- Title: ${title || 'Unknown'}
- Article Content: ${content?.substring(0, 2500) || 'No content available'}

IMPORTANT: Answer questions based on this article content. If the user asks to summarize, provide a clear summary of the key points from the article.`;
      } else if (context.type === 'program') {
        systemPrompt += `\n\nThe user is currently viewing a program page:
- Page Title: ${title || 'Unknown Program'}
- Page Content: ${content?.substring(0, 2000) || 'No content available'}

Answer questions specifically about this program when relevant.`;
      } else if (title || content) {
        systemPrompt += `\n\nThe user is currently on the ${context.pageName || 'website'} page.
- Page Title: ${title || 'Unknown'}
- Page Content Summary: ${content?.substring(0, 1000) || 'No content available'}`;
      }
    }

    // Build messages array
    const chatMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
    ];
    
    // Add conversation history (last 10 messages)
    if (conversationHistory && Array.isArray(conversationHistory)) {
      const recentHistory = conversationHistory.slice(-10);
      for (const msg of recentHistory) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          chatMessages.push({ role: msg.role, content: msg.content });
        }
      }
    }
    
    // Add current message
    chatMessages.push({ role: 'user', content: message.trim() });
    
    // Call OpenRouter API
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('[Global Chat] OPENROUTER_API_KEY is not set');
      return NextResponse.json({
        error: 'AI service not configured',
        reply: 'Sorry, the AI service is temporarily unavailable. Please try again later.',
      }, { status: 503 });
    }
    
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://germanpath.com',
        'X-Title': 'German Path AI Chat'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: chatMessages,
        temperature: 0.7,
        max_tokens: 800
      }),
      cache: 'no-store'
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Global Chat] OpenRouter error ${response.status}:`, errorText);
      return NextResponse.json({
        error: 'AI service error',
        reply: 'Sorry, I encountered an error. Please try again.',
      }, { status: 500 });
    }
    
    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
    
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
    
    // Check for specific error types
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage.includes('API key') || errorMessage.includes('apiKey')) {
      return NextResponse.json({
        error: 'AI service configuration error',
        reply: 'Sorry, the AI service is temporarily unavailable. Please try again later.',
      }, { status: 503 });
    }
    
    return NextResponse.json({
      error: 'Failed to process message',
      reply: 'Sorry, I encountered an error. Please try again.',
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
