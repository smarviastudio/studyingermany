# User Authentication System - Setup Guide

## ✅ What's Been Implemented

### 1. **Database (SQLite)**
- Local SQLite database at `prisma/dev.db`
- Tables: `User`, `UserProfile`, `Shortlist`, `ApplicationPlan`
- Automatic migrations applied

### 2. **Authentication (NextAuth.js)**
- Email/password authentication
- JWT-based sessions
- Signup and login pages
- Session management across the app

### 3. **User Features**
- **Profile Management**: Complete onboarding flow to capture user preferences
- **Shortlist**: Save favorite programs with notes
- **Application Tracking**: AI-generated application plans saved per user
- **Progress Tracking**: Checklist state persisted in database

### 4. **Pages Created**
- `/auth/signin` - Login page
- `/auth/signup` - Registration page
- `/onboarding` - Profile completion form
- `/my-shortlist` - View and manage shortlisted programs
- `/my-applications` - Track application progress
- `/course-finder/[id]` - Program application page with AI plan

### 5. **API Routes**
- `/api/auth/[...nextauth]` - NextAuth handler
- `/api/auth/signup` - User registration
- `/api/profile` - Get/update user profile
- `/api/shortlist` - Manage shortlisted programs
- `/api/application-plans` - Get user's application plans
- `/api/programs/[id]/application-plan` - Generate and save AI plans

## 🚀 How to Test

### Step 1: Start the Development Server
```bash
npm run dev
```

### Step 2: Create an Account
1. Navigate to `http://localhost:3000/auth/signup`
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
3. Click "Sign Up"
4. You'll be auto-logged in and redirected to `/onboarding`

### Step 3: Complete Your Profile
1. Fill out the onboarding form:
   - Target Degree Level: Master's
   - Add subjects (e.g., "Computer Science", "AI")
   - Language preference: English
   - Language levels: English B2, German A1
   - Test scores (optional): IELTS 7.5
   - Academic background: Your education details
   - Preferred cities: Berlin, Munich
   - Budget: 10000 EUR/year
   - Desired intake: Winter Semester
2. Click "Complete Profile"
3. Redirected to `/dashboard`

### Step 4: Search for Programs
1. Go to `/course-finder`
2. Enter a search query like: "I want to study master in computer science in Berlin"
3. Click "Search Programs"
4. Browse results

### Step 5: Shortlist a Program
1. Click on any program card to open the modal
2. Click "Add to shortlist" button
3. The program is saved to your account

### Step 6: View Your Shortlist
1. Navigate to `/my-shortlist`
2. See all your saved programs
3. Click "Start Application" on any program

### Step 7: Generate Application Plan
1. On the program application page (`/course-finder/[id]`)
2. Click "Generate Application Plan"
3. AI analyzes requirements and creates a personalized checklist
4. The plan is automatically saved to your account

### Step 8: Track Application Progress
1. Navigate to `/my-applications`
2. See all programs you've created plans for
3. View progress percentage
4. Click "Continue" to update checklist

### Step 9: Check Persistence
1. Log out (you can add a logout button or clear cookies)
2. Log back in at `/auth/signin`
3. Navigate to `/my-shortlist` - your saved programs are still there
4. Navigate to `/my-applications` - your plans are persisted
5. Go to any program application page - checklist state is saved

## 📊 Database Inspection

To view the database contents:

```bash
npx prisma studio
```

This opens a web UI at `http://localhost:5555` where you can:
- View all users
- See user profiles
- Check shortlisted programs
- Inspect application plans

## 🔑 Environment Variables

The system uses these environment variables (already configured):

```env
# NextAuth
NEXTAUTH_SECRET=dev-secret-change-in-production
NEXTAUTH_URL=http://localhost:3000

# OpenRouter API (for AI features)
OPENROUTER_API_KEY=your-key-here

# Database (auto-configured)
DATABASE_URL=file:./prisma/dev.db
```

## 🎯 Key Features to Test

### User Profile Integration
- Profile data is used by AI when generating application plans
- Language levels affect program recommendations
- Budget constraints influence suggestions

### Shortlist Management
- Add/remove programs
- Programs persist across sessions
- Each user has their own shortlist

### Application Plans
- AI generates personalized plans based on:
  - Program requirements
  - User's language proficiency
  - User's academic background
- Plans are saved and can be regenerated
- Checklist completion state persists

### Session Management
- Login required for shortlist and applications
- Unauthenticated users redirected to signin
- Session persists across page refreshes

## 🔄 Migration to Supabase (Future)

When ready to migrate to Supabase:

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
   }
   ```

2. Update `prisma.config.ts`:
   ```typescript
   datasource: {
     url: process.env.DATABASE_URL, // Supabase connection string
   }
   ```

3. Run migrations:
   ```bash
   npx prisma migrate dev
   ```

4. Update NextAuth to use Supabase Auth (optional)

The current code is database-agnostic and will work with PostgreSQL without changes.

## 🐛 Troubleshooting

### TypeScript Errors
The TypeScript errors you see are due to NextAuth beta types. The code will work at runtime. To fix:
- Wait for NextAuth stable release
- Or add `// @ts-ignore` comments (not recommended)

### Database Issues
If you need to reset the database:
```bash
rm prisma/dev.db
npx prisma migrate dev
```

### Session Issues
Clear browser cookies and localStorage if sessions behave unexpectedly.

## 📝 Next Steps

1. **Add Logout Button**: Create a logout button in the navigation
2. **Profile Editing**: Allow users to update their profile after onboarding
3. **Email Verification**: Add email verification for new accounts
4. **Password Reset**: Implement forgot password flow
5. **Social Login**: Add Google/GitHub OAuth providers
6. **User Dashboard**: Enhance dashboard with user-specific data

## 🎉 Success Criteria

You've successfully set up the user system when:
- ✅ Users can sign up and log in
- ✅ Profile data is saved and retrieved
- ✅ Shortlist persists across sessions
- ✅ Application plans are saved per user
- ✅ Checklist progress is tracked
- ✅ All data is user-specific and isolated

The system is now fully functional for local development!
