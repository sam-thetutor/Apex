# Farcaster Mini App Setup - Complete Guide

## 🎯 Overview

Your Apex app is now ready to be deployed as a Farcaster Mini App! This guide will walk you through the complete setup process.

## ✅ What's Already Done

- ✅ App built with Next.js 15
- ✅ Farcaster SDK integrated
- ✅ Wallet integration (Farcaster & MetaMask)
- ✅ AI-powered chat interface
- ✅ Real Base network balance fetching
- ✅ Manifest file created at `/.well-known/farcaster.json`
- ✅ LLM.txt file created
- ✅ Icon template created
- ✅ Deployment configuration ready

## 📋 Step-by-Step Deployment

### Step 1: Create App Icons

You need to create actual PNG files for your app icons. Follow these instructions:

#### Option A: Use Favicon.io (Easiest)

1. Go to [Favicon.io](https://favicon.io/)
2. Click "Text to Favicon"
3. Enter "A" as the text
4. Choose colors:
   - Background: `#14b8a6` (Teal)
   - Text: `#FFFFFF` (White)
5. Download the package
6. Rename files:
   - `android-chrome-192x192.png` → `icon-192.png`
   - `android-chrome-512x512.png` → `icon-512.png`
7. Copy both files to `/public/` folder

#### Option B: Use Canva

1. Go to [Canva](https://www.canva.com/)
2. Create a design (512x512 pixels)
3. Add your logo or text "A"
4. Export as PNG
5. Resize to both 192x192 and 512x512
6. Save to `/public/` folder

### Step 2: Create Screenshot

1. Run your app locally: `npm run dev`
2. Open http://localhost:3000
3. Take a screenshot of your app
4. Crop to 1280x720 pixels
5. Save as `screenshot-1.png` in `/public/` folder

### Step 3: Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for Farcaster deployment"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Add environment variables:
     - `OPENAI_API_KEY` = Your OpenAI API key
   - Click "Deploy"

3. **Note your Vercel URL:**
   - Example: `https://apex-base.vercel.app`
   - You'll need this for the next steps

### Step 4: Update Manifest with Your Domain

1. Open `/public/.well-known/farcaster.json`
2. Replace all instances of `your-domain.vercel.app` with your actual Vercel URL
3. Save the file

Example:
```json
{
  "miniapp": {
    "iconUrl": "https://apex-base.vercel.app/icon-512.png",
    "homeUrl": "https://apex-base.vercel.app",
    ...
  }
}
```

4. **Commit and push:**
   ```bash
   git add public/.well-known/farcaster.json
   git commit -m "Update manifest with production domain"
   git push origin main
   ```

### Step 5: Sign Your Manifest

1. **Go to Farcaster Developer Portal:**
   - Visit: https://farcaster.xyz/~/developers/mini-apps/manifest
   - Make sure you're logged into Farcaster

2. **Enter your domain:**
   - Enter your Vercel URL (e.g., `apex-base.vercel.app`)
   - Click "Sign Manifest"

3. **Copy the signed data:**
   - You'll receive a JSON object with `header`, `payload`, and `signature`
   - Copy this entire object

4. **Update your manifest:**
   - Open `/public/.well-known/farcaster.json`
   - Replace the `accountAssociation` object with the signed data from step 3
   - Save the file

5. **Commit and push:**
   ```bash
   git add public/.well-known/farcaster.json
   git commit -m "Add signed account association"
   git push origin main
   ```

### Step 6: Test Your Mini App

1. **Wait for Vercel to deploy** (usually 1-2 minutes)

2. **Test the manifest:**
   ```bash
   curl https://your-domain.vercel.app/.well-known/farcaster.json
   ```
   Should return your manifest with the signed `accountAssociation`

3. **Test in preview:**
   - Go to: https://farcaster.xyz/~/developers/mini-apps/preview
   - Enter your app URL
   - Click "Preview"
   - Your app should load!

### Step 7: Register Your Mini App

1. **Go to Developer Portal:**
   - Visit: https://farcaster.xyz/~/developers
   - Your app should appear in the list

2. **Verify all information:**
   - App name: "Apex"
   - Icon displays correctly
   - Description is accurate
   - All URLs are working

3. **Enable Developer Mode** (if not already enabled):
   - Visit: https://farcaster.xyz/~/settings/developer-tools
   - Toggle on "Developer Mode"

### Step 8: Share Your Mini App

Your Mini App is now live! You can:

1. **Share it in Farcaster:**
   - Post a cast with your app URL
   - The embed will automatically show up

2. **Add it to your profile:**
   - Users can add your app to their app list
   - They'll get notifications when you send them

3. **Test the features:**
   - ✅ Wallet connection
   - ✅ Balance queries
   - ✅ AI chat interface
   - ✅ Portfolio view

## 🎨 Customization Options

### Update Colors

Your app uses a Teal/Cyan color scheme. To change it:

1. Edit `/app/globals.css`
2. Update the `@theme` section with your colors
3. Redeploy

### Update App Name

1. Edit `/public/.well-known/farcaster.json`
2. Update the `name` field
3. Edit `/app/layout.tsx`
4. Update the `title` in metadata
5. Redeploy

## 📱 Testing Checklist

Before sharing your app, test:

- [ ] App loads without errors
- [ ] Wallet connects successfully
- [ ] Balance queries work
- [ ] Portfolio view displays correctly
- [ ] AI chat responds appropriately
- [ ] All pages are accessible
- [ ] Mobile view works correctly
- [ ] Icons display properly

## 🔧 Troubleshooting

### Manifest not found (404)

**Problem:** `curl` returns 404 for the manifest

**Solution:**
- Make sure the file is at `public/.well-known/farcaster.json`
- Check that Vercel deployed successfully
- Try accessing directly: `https://your-domain.vercel.app/.well-known/farcaster.json`

### Icons not displaying

**Problem:** Icons show as broken images

**Solution:**
- Make sure you created actual PNG files (not placeholders)
- Check file sizes are reasonable (< 1MB)
- Verify the URLs in manifest are correct
- Test the URLs directly in browser

### App not loading in preview

**Problem:** Preview tool shows error or blank screen

**Solution:**
- Check browser console for errors
- Verify `sdk.actions.ready()` is being called
- Make sure all dependencies are installed
- Check that environment variables are set

### Wallet not connecting

**Problem:** Wallet connection fails

**Solution:**
- Verify you're testing in Farcaster client (not just browser)
- Check that Farcaster SDK is initialized
- Make sure `WalletContext` is wrapping your app

## 🚀 Next Steps

After deployment:

1. **Share your app:**
   - Post a cast with your app URL
   - Share in Farcaster communities
   - Add to your profile

2. **Gather feedback:**
   - Monitor user interactions
   - Collect feedback
   - Iterate based on usage

3. **Add more features:**
   - Implement send token flow
   - Add swap functionality
   - Create transaction history

4. **Monitor analytics:**
   - Check Vercel analytics
   - Track user engagement
   - Monitor API usage

## 📚 Resources

- [Farcaster Mini Apps Docs](https://miniapps.farcaster.xyz)
- [Vercel Documentation](https://vercel.com/docs)
- [Base Network Docs](https://docs.base.org)
- [OpenAI API Docs](https://platform.openai.com/docs)

## 🆘 Need Help?

If you encounter issues:

1. Check the troubleshooting section above
2. Review the [FARCASTER_DEPLOYMENT.md](./FARCASTER_DEPLOYMENT.md) guide
3. Visit the [Farcaster Developer Portal](https://farcaster.xyz/~/developers)
4. Join Farcaster developer communities
5. Check the [Farcaster Mini Apps FAQ](https://miniapps.farcaster.xyz/docs/faq)

## ✅ Success Criteria

Your app is successfully deployed when:

- ✅ Manifest is accessible at `/.well-known/farcaster.json`
- ✅ Manifest is signed with your Farcaster account
- ✅ App loads in the preview tool
- ✅ All icons and images display correctly
- ✅ Wallet connects successfully
- ✅ AI features work as expected
- ✅ App appears in your developer portal

---

**Congratulations!** 🎉 You've successfully set up your Apex Mini App for Farcaster!

Now go ahead and share it with the Farcaster community!

