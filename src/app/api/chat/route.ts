import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { aiAssistant } from '@/lib/ai/assistant';
import { UserProfileSchema } from '@/lib/types';

const ChatRequestSchema = z.object({
  session_id: z.string(),
  message: z.string().min(1),
  user_profile: UserProfileSchema.optional(),
});

// Simple rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 20; // 20 requests per minute

function checkRateLimit(sessionId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(sessionId);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(sessionId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (userLimit.count >= RATE_LIMIT_MAX) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_id, message, user_profile } = ChatRequestSchema.parse(body);
    
    // Rate limiting
    if (!checkRateLimit(session_id)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Process message with AI assistant
    const result = await aiAssistant.processMessage(session_id, message, user_profile);
    
    return NextResponse.json({
      assistant_message: result.response,
      updated_profile: result.updatedProfile,
      referenced_program_ids: result.referencedProgramIds,
      session_id,
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request format', details: error.issues },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'session_id parameter required' },
        { status: 400 }
      );
    }
    
    const conversation = aiAssistant.getConversation(sessionId);
    const userProfile = aiAssistant.getUserProfile(sessionId);
    
    return NextResponse.json({
      conversation,
      user_profile: userProfile,
      session_id: sessionId,
    });
    
  } catch (error) {
    console.error('Get conversation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
