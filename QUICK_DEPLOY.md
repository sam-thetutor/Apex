# Quick Deploy to Vercel

Your app is now ready to deploy! Follow these steps:

## Option 1: Deploy via Vercel CLI (Fastest)

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## Option 2: Deploy via GitHub

1. **Create a GitHub repository:**
   ```bash
   # Create a new repo on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Add Environment Variables:**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add: `OPENAI_API_KEY` = your API key
   - Add: `NEXT_PUBLIC_SITE_URL` = https://apex-alpha-livid.vercel.app

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete

## After Deployment

Once deployed, you need to sign your manifest:

1. **Go to Farcaster Developer Portal:**
   https://farcaster.xyz/~/developers/mini-apps/manifest

2. **Enter your domain:**
   ```
   apex-alpha-livid.vercel.app
   ```

3. **Copy the signed data:**
   - You'll receive a JSON object with `header`, `payload`, and `signature`
   - Copy this entire object

4. **Update your manifest:**
   ```bash
   # Edit public/.well-known/farcaster.json
   # Replace the accountAssociation object with the signed data
   ```

5. **Push changes:**
   ```bash
   git add public/.well-known/farcaster.json
   git commit -m "Add signed account association"
   git push
   ```

6. **Test your Mini App:**
   - Go to: https://farcaster.xyz/~/developers/mini-apps/preview
   - Enter: https://apex-alpha-livid.vercel.app
   - Click "Preview"
   - Your app should load!

## Verify Deployment

After deploying, verify these URLs work:

- ✅ https://apex-alpha-livid.vercel.app/.well-known/farcaster.json
- ✅ https://apex-alpha-livid.vercel.app/icon-512.svg
- ✅ https://apex-alpha-livid.vercel.app/screenshot-1.svg
- ✅ https://apex-alpha-livid.vercel.app/llm.txt

---

**Need help?** Check FARCASTER_SETUP_GUIDE.md for detailed instructions.

