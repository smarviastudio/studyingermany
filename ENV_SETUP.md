# Environment Variables Setup

## Quick Fix for the Console Error

The error you're seeing is because NextAuth needs environment variables to work properly.

### Step 1: Create `.env.local` file

In the project root directory, create a file named `.env.local` with this content:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=dev-secret-change-in-production-please-use-a-random-string
NEXTAUTH_URL=http://localhost:3000
AUTH_TRUST_HOST=true

# OpenRouter API (for AI features)
OPENROUTER_API_KEY=sk-or-v1-your-key-here

# Database (auto-configured by Prisma)
DATABASE_URL=file:./prisma/dev.db
```

### Step 2: Restart the Dev Server

After creating the file:
1. Stop the current dev server (Ctrl+C)
2. Run `npm run dev` again
3. Refresh your browser

The console error should be gone!

## Important Notes

- **NEXTAUTH_SECRET**: Used to encrypt JWT tokens. In production, use a strong random string.
- **AUTH_TRUST_HOST**: Required for NextAuth v5 (beta) to work on localhost.
- **OPENROUTER_API_KEY**: Get this from https://openrouter.ai/keys if you want AI features to work.

## Generating a Secure Secret (for production)

```bash
openssl rand -base64 32
```

Or use any random string generator.
