import { csvDataProvider } from '../data/CSVDataProvider';
import { SearchFilters, UserProfile } from '../types';

export const tools = [
  {
    type: 'function' as const,
    function: {
      name: 'search_programs',
      description: 'Search for academic programs based on filters and optional query text',
      parameters: {
        type: 'object',
        properties: {
          filters: {
            type: 'object',
            properties: {
              degree_level: {
                type: 'string',
                enum: ['bachelor', 'master', 'phd', 'non_degree', 'any'],
                description: 'Target degree level'
              },
              subjects: {
                type: 'array',
                items: { type: 'string' },
                description: 'Subject areas of interest'
              },
              language: {
                type: 'string',
                enum: ['english', 'german', 'either'],
                description: 'Preferred teaching language'
              },
              cities: {
                type: 'array',
                items: { type: 'string' },
                description: 'Preferred cities'
              },
              max_tuition: {
                type: 'number',
                description: 'Maximum tuition in EUR'
              },
              intake_term: {
                type: 'string',
                enum: ['winter', 'summer', 'any'],
                description: 'Preferred intake term'
              },
              min_confidence: {
                type: 'number',
                description: 'Minimum data confidence score (0-1)'
              }
            }
          },
          query_text: {
            type: 'string',
            description: 'Optional text query for semantic search'
          },
          limit: {
            type: 'number',
            default: 12,
            description: 'Maximum number of results to return'
          }
        },
        required: ['filters']
      }
    }
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_program',
      description: 'Get detailed information about a specific program by ID',
      parameters: {
        type: 'object',
        properties: {
          program_id: {
            type: 'string',
            description: 'The unique program ID'
          }
        },
        required: ['program_id']
      }
    }
  },
  {
    type: 'function' as const,
    function: {
      name: 'update_user_profile',
      description: 'Update the user profile with new information extracted from conversation',
      parameters: {
        type: 'object',
        properties: {
          profile_updates: {
            type: 'object',
            properties: {
              target_degree_level: {
                type: 'string',
                enum: ['bachelor', 'master', 'phd', 'non_degree', 'any']
              },
              target_subjects: {
                type: 'array',
                items: { type: 'string' }
              },
              preferred_language: {
                type: 'string',
                enum: ['english', 'german', 'either']
              },
              german_level: {
                type: 'string',
                enum: ['none', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2']
              },
              english_level: {
                type: 'string',
                enum: ['none', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2']
              },
              preferred_cities: {
                type: 'array',
                items: { type: 'string' }
              },
              max_tuition_eur: {
                type: 'number'
              },
              desired_intake: {
                type: 'string',
                enum: ['winter', 'summer', 'any']
              },
              desired_start_year: {
                type: 'number'
              },
              constraints: {
                type: 'string'
              },
              budget_notes: {
                type: 'string'
              }
            }
          }
        },
        required: ['profile_updates']
      }
    }
  }
];

export async function executeToolCall(toolName: string, args: any) {
  switch (toolName) {
    case 'search_programs':
      const { filters, query_text, limit = 12 } = args;
      return await csvDataProvider.searchPrograms(filters as SearchFilters, query_text, limit);
    
    case 'get_program':
      const { program_id } = args;
      return await csvDataProvider.getProgram(program_id);
    
    case 'update_user_profile':
      // This is handled in the chat route - just return the updates
      return args.profile_updates;
    
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}
