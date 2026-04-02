# Hostinger Deployment Guide

## Architecture Overview

Your application now uses a **headless WordPress + Next.js** setup:

- **WordPress (Backend)**: Content management, blog posts, REST API
- **Next.js (Frontend)**: Public-facing website, AI tools, homepage

## What Changed

✅ WordPress homepage now redirects to Next.js app  
✅ All tool navigation links point to homepage (not dashboard)  
✅ WordPress serves content via REST API only  
✅ Next.js fetches and displays WordPress articles

---

## Deployment Steps for Hostinger

### 1. Deploy Next.js App

**Option A: Using Hostinger Node.js App Manager**

1. Log into Hostinger control panel
2. Navigate to **Advanced** → **Node.js**
3. Create new Node.js application:
   - **Application root**: `/public_html/nextjs` (or your preferred path)
   - **Application URL**: `https://germanpath.com` (your domain)
   - **Node.js version**: 18.x or higher
   - **Application mode**: Production

4. Upload your Next.js project files via FTP/SFTP or Git:
   ```bash
   # From your local machine
   cd /Users/salman/Desktop/daad-ai-consultant
   
   # Build the production app
   npm run build
   
   # Upload these folders/files to Hostinger:
   # - .next/
   # - public/
   # - package.json
   # - package-lock.json
   # - next.config.ts
   # - All other config files
   ```

5. In Hostinger Node.js manager, set:
   - **Application startup file**: `node_modules/next/dist/bin/next`
   - **Application startup command**: `start`
   - **Environment variables**:
     ```
     WP_URL=https://yourdomain.com/wp
     NEXTAUTH_URL=https://germanpath.com
     NEXTAUTH_SECRET=<generate-random-secret>
     DATABASE_URL=<your-hostinger-mysql-url>
     NEXT_PUBLIC_GA_ID=<your-google-analytics-id>
     ```

6. Install dependencies in Hostinger terminal:
   ```bash
   cd /public_html/nextjs
   npm install --production
   ```

7. Start the application via Node.js manager

**Option B: Deploy to Vercel (Recommended)**

Vercel offers better Next.js performance and is free for hobby projects:

1. Push your code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Set environment variables in Vercel dashboard
4. Point your domain DNS to Vercel

---

### 2. Configure WordPress (Headless Backend)

WordPress stays on Hostinger and serves content via API.

**File Location**: `/public_html/wp-content/themes/students-in-germany/front-page.php`

✅ Already updated to redirect homepage to Next.js

**Set Environment Variable** (in wp-config.php or .htaccess):
```php
// In wp-config.php, add before "That's all, stop editing!"
define('NEXTJS_URL', 'https://germanpath.com');
```

**WordPress Admin Access**:
- URL: `https://yourdomain.com/wp-admin`
- Keep managing posts, categories, media here
- Front-end visitors never see WordPress theme

---

### 3. Database Setup

Your Next.js app needs access to the same MySQL database as WordPress.

**Get Database Credentials from Hostinger**:
1. Go to **Databases** → **MySQL Databases**
2. Note down:
   - Database name
   - Username
   - Password
   - Host (usually `localhost`)

**Set DATABASE_URL** in Next.js environment:
```
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
```

---

### 4. Domain & DNS Configuration

**If Next.js is on Hostinger Node.js**:
- Point domain A record to Hostinger IP
- Configure in Hostinger control panel

**If Next.js is on Vercel**:
1. In Vercel project settings → Domains
2. Add your domain: `germanpath.com`
3. Update DNS records as instructed by Vercel
4. WordPress subdomain (optional): `blog.germanpath.com` → Hostinger IP

---

### 5. SSL Certificate

**Hostinger**: Auto-SSL via control panel (Let's Encrypt)  
**Vercel**: Automatic SSL for all domains

---

### 6. Test Deployment

1. **Homepage**: Visit `https://germanpath.com` → should show Next.js app
2. **WordPress Admin**: Visit `https://germanpath.com/wp-admin` → should work
3. **API Test**: Visit `https://germanpath.com/api/wp-posts` → should return JSON
4. **Articles**: Check if WordPress posts appear on Next.js homepage
5. **Tools**: Test CV Maker, Cover Letter, GPA Converter, etc.

---

## Environment Variables Reference

### Next.js (.env.production)
```bash
# WordPress API
WP_URL=https://germanpath.com/wp

# NextAuth
NEXTAUTH_URL=https://germanpath.com
NEXTAUTH_SECRET=<generate-with: openssl rand -base64 32>

# Database (same as WordPress)
DATABASE_URL=mysql://user:pass@localhost:3306/dbname

# Google Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### WordPress (wp-config.php)
```php
define('NEXTJS_URL', 'https://germanpath.com');
```

---

## File Structure on Hostinger

```
/public_html/
├── wp/                          # WordPress installation
│   ├── wp-admin/
│   ├── wp-content/
│   │   └── themes/
│   │       └── students-in-germany/
│   │           └── front-page.php  # ✅ Redirects to Next.js
│   ├── wp-includes/
│   └── wp-config.php            # ✅ Set NEXTJS_URL here
│
└── nextjs/                      # Next.js app (if using Hostinger Node.js)
    ├── .next/
    ├── public/
    ├── package.json
    └── ...
```

---

## Troubleshooting

### WordPress homepage shows old content
- Clear WordPress cache (if using cache plugin)
- Verify `front-page.php` has redirect code
- Check if theme is active in WP Admin → Appearance → Themes

### Next.js can't fetch WordPress posts
- Test API directly: `https://yourdomain.com/wp/wp-json/wp/v2/posts`
- Verify `WP_URL` environment variable is correct
- Check CORS settings in WordPress (should allow Next.js domain)

### Images not loading
- Verify `next.config.ts` has correct `remotePatterns`
- Check WordPress media library URLs
- Ensure WordPress uploads folder is accessible

### Node.js app won't start on Hostinger
- Check Node.js version compatibility (18.x+)
- Verify all dependencies installed: `npm install`
- Check Hostinger error logs in control panel
- Consider using Vercel instead (easier for Next.js)

---

## Recommended: Use Vercel for Next.js

Hostinger is great for WordPress, but Vercel is optimized for Next.js:

✅ Automatic deployments from Git  
✅ Edge network (faster globally)  
✅ Free SSL & CDN  
✅ Zero config needed  
✅ Better Next.js performance  

**Setup**:
1. Push code to GitHub
2. Import on vercel.com
3. Set environment variables
4. Point domain to Vercel
5. Keep WordPress on Hostinger for content management

---

## Support

- **Hostinger Support**: For WordPress, database, domain issues
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## Quick Start Commands

```bash
# Local development
cd /Users/salman/Desktop/daad-ai-consultant
npm run dev

# Build for production
npm run build

# Start production server (local test)
npm start

# Deploy to Vercel
npx vercel --prod
```
