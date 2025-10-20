# Vercel Deployment Checklist

## Pre-Deployment

- [x] ✅ Build passes locally (`npm run build`)
- [x] ✅ All TypeScript errors resolved
- [x] ✅ Environment variables documented
- [x] ✅ `vercel.json` configured
- [x] ✅ `.vercelignore` created
- [x] ✅ `next.config.js` optimized
- [x] ✅ `README.md` with deployment instructions

## Deployment Steps

### 1. Push to Git Repository

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your Git repository
4. Vercel will auto-detect Next.js settings
5. Configure environment variables:
   - `OPENAI_API_KEY` = Your OpenAI API key
   - `NEXT_PUBLIC_SITE_URL` = Will be set automatically
6. Click **"Deploy"**

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? apex-base (or your choice)
# - Directory? ./
# - Override settings? No
```

### 3. Set Environment Variables in Vercel

After deployment, add these environment variables in the Vercel dashboard:

```
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

### 4. Redeploy

After adding environment variables, trigger a new deployment:
- Go to your project in Vercel dashboard
- Click **"Deployments"** tab
- Click the **"..."** menu on the latest deployment
- Click **"Redeploy"**

## Post-Deployment

### 1. Update Farcaster Configuration

Update your Farcaster Mini App configuration with your Vercel URL:
- Go to your Farcaster Mini App settings
- Update the app URL to: `https://your-app.vercel.app`
- Save changes

### 2. Test Your Deployment

Visit your deployed app and test:
- [ ] Homepage loads correctly
- [ ] Chat interface works
- [ ] Wallet connection works
- [ ] Balance queries return data
- [ ] AI responses are working
- [ ] All pages are accessible

### 3. Custom Domain (Optional)

To add a custom domain:
1. Go to your project in Vercel dashboard
2. Click **"Settings"** → **"Domains"**
3. Add your domain
4. Update DNS records as instructed
5. Update `NEXT_PUBLIC_SITE_URL` environment variable

## Troubleshooting

### Build Fails

**Error:** `Cannot find module`
- **Solution:** Run `npm install --legacy-peer-deps` locally and commit `package-lock.json`

**Error:** `Type error`
- **Solution:** Fix TypeScript errors locally first

### Runtime Errors

**Error:** `OPENAI_API_KEY is not defined`
- **Solution:** Add the environment variable in Vercel dashboard

**Error:** `CORS error`
- **Solution:** Check that `NEXT_PUBLIC_SITE_URL` is set correctly

### Performance Issues

**Slow API responses:**
- Check OpenAI API rate limits
- Consider caching responses
- Optimize database queries (if any)

## Environment Variables Reference

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `OPENAI_API_KEY` | OpenAI API key for AI features | `sk-proj-...` | Yes |
| `NEXT_PUBLIC_SITE_URL` | Your app's public URL | `https://apex-base.vercel.app` | Yes |

## Production Checklist

- [ ] All environment variables set
- [ ] Custom domain configured (if applicable)
- [ ] Farcaster integration updated
- [ ] Analytics configured (optional)
- [ ] Error tracking configured (optional)
- [ ] Performance monitoring enabled (optional)

## Support

If you encounter issues:
1. Check the [Vercel documentation](https://vercel.com/docs)
2. Check the [Next.js documentation](https://nextjs.org/docs)
3. Review the build logs in Vercel dashboard
4. Check browser console for client-side errors

---

**Ready to deploy?** Follow the steps above and your app will be live in minutes! 🚀

