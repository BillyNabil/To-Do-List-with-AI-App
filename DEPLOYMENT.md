# Deployment Instructions

## 1. GitHub Setup

### Create GitHub Repository:
1. Go to https://github.com and sign in
2. Click "+" button in top right > "New repository"
3. Repository name: `ai-schedule-app`
4. Description: `AI-powered schedule management application`
5. Make it **Public** (for free Vercel deployment)
6. **DO NOT** add README, .gitignore, or license (we already have them)
7. Click "Create repository"

### Push to GitHub:
```bash
# Replace with your GitHub username
git remote set-url origin https://github.com/YOUR_USERNAME/ai-schedule-app.git
git push -u origin main
```

## 2. Vercel Deployment (Recommended)

### Automatic Deployment:
1. Go to https://vercel.com and sign in with GitHub
2. Click "New Project"
3. Import your `ai-schedule-app` repository
4. Vercel will auto-detect Next.js settings
5. **Important**: Add Environment Variables in Vercel dashboard:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

### Manual Deployment (Alternative):
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 3. Environment Variables Setup

### Get Required Keys:

#### Supabase:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Settings > API
4. Copy:
   - Project URL
   - anon public key
   - service_role key

#### Gemini AI:
1. Go to https://makersuite.google.com/app/apikey
2. Create new API key
3. Copy the key

### Add to Vercel:
1. Go to your Vercel project dashboard
2. Settings > Environment Variables
3. Add all the variables above

## 4. Deploy Commands

### Production Build:
```bash
npm run build
npm start
```

### Lint Check:
```bash
npm run lint
```

## 5. Security Notes

✅ **Already Secured:**
- `.env.local` is in `.gitignore` (won't be pushed to GitHub)
- API routes are protected
- Supabase RLS policies are configured

⚠️ **Remember:**
- Never commit `.env.local` files
- Keep API keys secret
- Use environment variables for all sensitive data

## 6. Custom Domain (Optional)

### In Vercel:
1. Project Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed

### Update Environment Variable:
```
NEXT_PUBLIC_APP_URL=https://your-custom-domain.com
```

## 7. Post-Deployment Checklist

- [ ] Test authentication flow
- [ ] Test AI chat functionality
- [ ] Test task creation/editing
- [ ] Test responsive design on mobile
- [ ] Verify dark mode works
- [ ] Check all animations and transitions
- [ ] Test error handling

## 8. Monitoring

### Vercel Analytics:
- Built-in analytics in Vercel dashboard
- Monitor performance and usage

### Supabase Logs:
- Check Supabase dashboard for database activity
- Monitor API usage and errors

---

Your app will be live at: `https://your-app.vercel.app`
