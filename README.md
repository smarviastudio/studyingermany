# DAAD AI Consultant

An intelligent chat-based assistant for discovering German academic programs from the DAAD database. This production-ready MVP helps international students find suitable programs based on their profile and preferences.

## Features

- **AI-Powered Conversations**: Natural language interface for program discovery
- **Smart Filtering**: Advanced search with degree level, subject, language, location, and budget filters
- **Profile Management**: Persistent user profiles with preferences and requirements
- **Program Details**: Comprehensive program information with intake dates, tuition, and requirements
- **Real-time Search**: TF-IDF semantic search with relevance scoring
- **Quality Indicators**: Data confidence scores and quality warnings
- **Responsive UI**: Modern chat interface with sidebar profile and results panel

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js Route Handlers (API routes)
- **Data Source**: Local CSV file with 100 enriched DAAD programs
- **AI**: OpenAI GPT-4 with function calling
- **Search**: Natural.js TF-IDF for semantic search
- **Validation**: Zod schemas for type safety
- **Rate Limiting**: In-memory token bucket

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key

### Installation

1. **Clone and setup**:
   ```bash
   cd daad-ai-consultant
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your OpenAI API key
   ```

3. **Verify data file**:
   ```bash
   ls -la data/programs.csv
   # Should show the CSV file with program data
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open application**:
   Visit [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create `.env.local` with:

```bash
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=development
```

## Data Structure

The application expects a CSV file at `/data/programs.csv` with these columns:

- `course_id`, `course_name`, `university_name`, `city`
- `degree_level_normalized`, `subject_area`, `subject_tags`
- `languages_array`, `language_level_german`, `language_level_english`
- `beginning_normalized`, `programme_duration`, `intakes`
- `tuition_fee_number`, `tuition_fee_currency`
- `application_deadline_raw`, `requirements_text_clean`
- `quality_warnings`, `confidence_score`
- `detail_url` (for external links)

## API Endpoints

### Chat API
- `POST /api/chat` - Process user messages with AI assistant
- `GET /api/chat?session_id=xxx` - Retrieve conversation history

### Programs API
- `POST /api/programs/search` - Search programs with filters
- `GET /api/programs/search?query=xxx` - Search via query parameters
- `GET /api/programs/[id]` - Get detailed program information

### Development API
- `POST /api/reload` - Reload CSV data (development only)

## Usage Examples

### Basic Conversation
```
User: "I'm looking for a Master's in Computer Science in Berlin"
AI: [Searches programs, shows results with citations]
```

### Follow-up Refinements
```
User: "Only programs under 5000 EUR"
AI: [Applies budget filter, shows updated results]
```

### Program Details
```
User: "Tell me more about the AI program at TU Munich"
AI: [Uses get_program tool, shows detailed information]
```

## Architecture

### Data Flow
1. **CSV Loader**: Normalizes and caches program data in memory
2. **Data Provider**: Abstracts data access with filtering and search
3. **AI Assistant**: Processes conversations with tool calling
4. **API Routes**: Handle HTTP requests and responses
5. **UI Components**: React components for chat, profile, and results

### Tool Calling System
The AI assistant uses three tools:
- `search_programs`: Filter and rank programs
- `get_program`: Retrieve detailed program information  
- `update_user_profile`: Extract profile updates from conversation

### Migration Path
The `DataProvider` interface allows easy migration to databases:
- Current: `CSVDataProvider` (in-memory)
- Future: `SupabaseDataProvider` (planned)

## Development

### Project Structure
```
src/
├── app/
│   ├── api/          # API route handlers
│   └── page.tsx      # Main application page
├── components/       # React UI components
├── lib/
│   ├── ai/          # AI assistant and tools
│   ├── csv/         # CSV loading and parsing
│   ├── data/        # Data provider interfaces
│   └── types.ts     # TypeScript schemas
└── data/
    └── programs.csv  # Program data source
```

### Adding New Features

1. **New Search Filters**: Update `SearchFilters` schema and `CSVDataProvider.applyFilters()`
2. **New Program Fields**: Update `Program` schema and CSV loader mapping
3. **New AI Tools**: Add to `tools.ts` and `executeToolCall()`

### Testing

Run basic functionality tests:
```bash
# Test CSV loading
curl http://localhost:3000/api/programs/search

# Test AI chat (requires OpenAI key)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"session_id":"test","message":"Hello"}'
```

## Production Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Setup
- Set `OPENAI_API_KEY` in production environment
- Ensure `data/programs.csv` is included in deployment
- Configure rate limiting for production traffic

## Troubleshooting

### Common Issues

1. **"CSV file not found"**: Ensure `/data/programs.csv` exists
2. **"OpenAI API error"**: Check API key and quota
3. **"No programs found"**: Verify CSV data format and content
4. **TypeScript errors**: Run `npm run type-check`

### Debug Mode
Enable debug panel in UI to see:
- Current user profile
- Applied search filters
- Program ranking scores

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push branch: `git push origin feature/new-feature`
5. Submit pull request

## License

MIT License - see LICENSE file for details.
