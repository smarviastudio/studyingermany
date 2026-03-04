import { tools, executeToolCall } from './tools';
import { UserProfile, ChatMessage } from '../types';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = 'google/gemini-2.5-flash-lite';

// Simplified version without tool calling for initial testing
async function callOpenRouter(messages: any[]) {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key not configured');
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'DAAD AI Consultant'
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 1500
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenRouter API error:', response.status, errorText);
    throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

const SYSTEM_PROMPT = `You are an AI consultant specializing in German academic programs (DAAD database). Your role is to help international students find suitable programs based on their profile and preferences.

BEHAVIOR:
1. When a user provides their complete profile (degree level, subjects, language, location, budget, timing), IMMEDIATELY use the search_programs tool to find relevant programs.

2. After finding programs, provide detailed recommendations that include:
   - Program name, university, and location
   - Key details: degree level, tuition, intake timing, language
   - AI-generated explanation of why each program is an excellent fit for their specific profile
   - Highlight unique strengths and opportunities of each program
   - Include proper citations with program ID and university name

3. For each recommended program, explain:
   - How it matches their subject interests
   - Why the location/university is beneficial
   - Career prospects and opportunities
   - Any special features or advantages

4. Use ONLY the search_programs tool to find programs - never invent or hallucinate programs.

5. Handle follow-up questions by updating filters and re-searching:
   - "Only Berlin" → add city filter
   - "Cheaper options" → reduce max_tuition
   - "Winter 2026" → set intake_term to winter
   - "More details about [program]" → use get_program tool

6. Always maintain conversation context and user profile throughout the session.

RESPONSE FORMAT:
- Be conversational and enthusiastic about the opportunities
- Use clear formatting for program lists
- Include detailed AI explanations for why each program fits
- Include citations like: "(Program ID: abc123, University: TU Munich)"
- Offer specific next steps or refinements

QUALITY GUIDELINES:
- Acknowledge quality warnings when present
- Explain confidence scores when relevant
- Be transparent about data limitations
- Suggest contacting universities directly for the most current information`;

export class AIAssistant {
  private conversations: Map<string, ChatMessage[]> = new Map();
  private userProfiles: Map<string, UserProfile> = new Map();

  async processMessage(
    sessionId: string,
    message: string,
    currentProfile?: UserProfile
  ): Promise<{
    response: string;
    updatedProfile: UserProfile;
    referencedProgramIds: string[];
  }> {
    // Initialize or get conversation history
    const messages = this.conversations.get(sessionId) || [];
    const userProfile = currentProfile || this.userProfiles.get(sessionId) || this.getDefaultProfile();

    // Add user message
    messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    try {
      // Use OpenRouter with tool calling enabled
      const apiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3001',
          'X-Title': 'DAAD AI Consultant'
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'system', content: `Current user profile: ${JSON.stringify(userProfile)}` },
            ...messages.map(msg => ({
              role: msg.role as 'user' | 'assistant' | 'system',
              content: msg.content
            }))
          ],
          tools,
          tool_choice: 'auto',
          temperature: 0.7,
          max_tokens: 1500
        })
      });

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error('OpenRouter API error:', apiResponse.status, errorText);
        throw new Error(`OpenRouter API error: ${apiResponse.status} ${apiResponse.statusText}`);
      }

      const completion = await apiResponse.json();

      const assistantMessage = completion.choices[0].message;
      let responseText = assistantMessage.content || '';
      let updatedProfile = { ...userProfile };
      const referencedProgramIds: string[] = [];

      // Check if user is requesting program recommendations and manually trigger search
      const isRequestingPrograms = message.toLowerCase().includes('program recommendations') || 
                                  message.toLowerCase().includes('search for programs') ||
                                  message.toLowerCase().includes('show me programs') ||
                                  message.toLowerCase().includes('completed my profile');

      if (isRequestingPrograms && (userProfile.target_degree_level || userProfile.target_subjects?.length)) {
        try {
          // Build search filters from user profile
          const filters: any = {};
          
          if (userProfile.target_degree_level) {
            filters.degree_level = userProfile.target_degree_level;
          }
          
          if (userProfile.target_subjects && userProfile.target_subjects.length > 0) {
            filters.subjects = userProfile.target_subjects;
          }
          
          if (userProfile.preferred_language && userProfile.preferred_language !== 'either') {
            filters.language = userProfile.preferred_language;
          }
          
          if (userProfile.preferred_cities && userProfile.preferred_cities.length > 0) {
            filters.cities = userProfile.preferred_cities;
          }
          
          if (userProfile.max_tuition_eur) {
            filters.max_tuition = userProfile.max_tuition_eur;
          }
          
          if (userProfile.desired_intake && userProfile.desired_intake !== 'any') {
            filters.intake_term = userProfile.desired_intake;
          }

          // Search for programs
          const searchResult = await executeToolCall('search_programs', { filters, limit: 8 });
          
          if (Array.isArray(searchResult) && searchResult.length > 0) {
            // Extract program IDs for reference tracking
            searchResult.forEach((program: any) => {
              if (program.id) referencedProgramIds.push(program.id);
            });

            // Generate AI recommendations with detailed explanations
            const recommendationPrompt = `I found ${searchResult.length} excellent Master's programs that match your profile! Here are the programs:

${searchResult.map((program: any, index: number) => `
**${index + 1}. ${program.program_name}**
- University: ${program.university}
- Location: ${program.city}
- Tuition: ${program.tuition_fee_number === 0 ? 'Free' : program.tuition_fee_number ? `€${program.tuition_fee_number}/year` : 'Contact university'}
- Intake: ${program.beginning_normalized || 'Contact university'}
- Program ID: ${program.id}
- Match Score: ${Math.round((program.match_score || 0) * 100)}%
- Why it's great: ${program.match_reason || 'Excellent match for your profile'}
`).join('\n')}

Based on your interests in ${userProfile.target_subjects?.join(' and ')}, these programs offer excellent opportunities in your preferred cities of ${userProfile.preferred_cities?.join(' and ')}. Each program is taught in English and fits within your budget of €${userProfile.max_tuition_eur}/year.

Would you like more details about any specific program, or would you like me to search with different criteria?`;

            responseText = recommendationPrompt;
          } else {
            responseText = `I searched for Master's programs in ${userProfile.target_subjects?.join(' and ')} in ${userProfile.preferred_cities?.join(' and ')}, but didn't find any exact matches with your current criteria. 

Let me try a broader search or you can adjust your preferences. Would you like me to:
1. Search in more cities across Germany
2. Look at programs with higher tuition fees
3. Consider programs in related subjects
4. Look at different intake periods

What would you prefer?`;
          }
        } catch (error) {
          console.error('Program search error:', error);
        }
      }

      // Handle tool calls if present (fallback)
      if (assistantMessage.tool_calls) {
        const toolResults: string[] = [];

        for (const toolCall of assistantMessage.tool_calls) {
          try {
            if (toolCall.type === 'function') {
              const result = await executeToolCall(
                toolCall.function.name,
                JSON.parse(toolCall.function.arguments)
              );

              if (toolCall.function.name === 'search_programs') {
                if (Array.isArray(result)) {
                  result.forEach((program: any) => {
                    if (program.id) referencedProgramIds.push(program.id);
                  });
                }
                toolResults.push(`Found ${result.length} programs matching criteria`);
              } else if (toolCall.function.name === 'get_program') {
                if (result) {
                  referencedProgramIds.push(result.id);
                  toolResults.push(`Retrieved details for program: ${result.program_name}`);
                }
              } else if (toolCall.function.name === 'update_user_profile') {
                updatedProfile = { ...updatedProfile, ...result };
                toolResults.push('Updated user profile');
              }
            }
          } catch (error) {
            console.error(`Tool call error:`, error);
            toolResults.push(`Error executing tool call`);
          }
        }
      }

      // Add assistant response to conversation
      messages.push({
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      });

      // Update stored conversation and profile
      this.conversations.set(sessionId, messages);
      this.userProfiles.set(sessionId, updatedProfile);

      return {
        response: responseText,
        updatedProfile,
        referencedProgramIds
      };

    } catch (error) {
      console.error('OpenRouter API error:', error);
      throw new Error('Failed to process message with AI assistant');
    }
  }

  getConversation(sessionId: string): ChatMessage[] {
    return this.conversations.get(sessionId) || [];
  }

  private getDefaultProfile(): UserProfile {
    return {
      target_subjects: [],
      preferred_language: 'either',
      preferred_cities: [],
      desired_intake: 'any'
    };
  }

  getUserProfile(sessionId: string): UserProfile {
    return this.userProfiles.get(sessionId) || this.getDefaultProfile();
  }

  clearSession(sessionId: string): void {
    this.conversations.delete(sessionId);
    this.userProfiles.delete(sessionId);
  }
}

export const aiAssistant = new AIAssistant();
