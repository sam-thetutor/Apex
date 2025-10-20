# Farcaster Mini App Deployment Guide

## Overview

This guide will help you deploy your Apex app to Farcaster and make it available as a Mini App.

## Prerequisites

1. ✅ Deploy your app to Vercel (or another hosting platform)
2. ✅ Get your deployed app URL (e.g., `https://apex-base.vercel.app`)
3. ✅ Have a Farcaster account
4. ✅ Complete the Farcaster Mini App registration

## Step 1: Deploy to Vercel

First, ensure your app is deployed and accessible:

```bash
# Push your code to GitHub
git add .
git commit -m "Prepare for Farcaster deployment"
git push origin main

# Deploy to Vercel (or use Vercel dashboard)
vercel
```

**Important:** Note your Vercel deployment URL (e.g., `https://apex-base.vercel.app`)

## Step 2: Prepare App Icons

Create app icons and place them in the `public` folder:

### Required Icons:
- `icon-192.png` - 192x192px PNG
- `icon-512.png` - 512x512px PNG
- `screenshot-1.png` - 1280x720px PNG (app screenshot)

### Quick Icon Generation:

You can use an online tool like:
- [Favicon.io](https://favicon.io/)
- [Canva](https://www.canva.com/)
- Or create them with your design tool

**Design Tips:**
- Use your app's color scheme (teal/cyan)
- Keep it simple and recognizable
- Ensure it looks good at small sizes

## Step 3: Register with Farcaster

### 3.1 Access Farcaster Developer Portal

1. Go to [Farcaster Developer Portal](https://warpcast.com/~/developers)
2. Log in with your Farcaster account
3. Navigate to "Mini Apps" section

### 3.2 Create New Mini App

1. Click "Create Mini App"
2. Fill in the app details:

```
App Name: Apex
Short Description: AI-powered token management on Base
Long Description: Send, receive, and swap tokens through natural language commands
Category: Finance
```

### 3.3 Configure App Settings

**App URL:**
```
https://your-vercel-url.vercel.app
```

**Manifest URL:**
```
https://your-vercel-url.vercel.app/manifest.json
```

**LLM Context URL:**
```
https://your-vercel-url.vercel.app/llm.txt
```

**Icon URL:**
```
https://your-vercel-url.vercel.app/icon-512.png
```

**Screenshot URL:**
```
https://your-vercel-url.vercel.app/screenshot-1.png
```

### 3.4 Set Permissions

Enable the following permissions:
- ✅ `wallet` - For wallet interactions
- ✅ `ethereum` - For Ethereum provider access
- ✅ `user` - For user information

### 3.5 Configure Wallet Integration

**Wallet Actions:**
- `sendToken` - Send tokens to addresses
- `swapToken` - Swap between tokens
- `getEthereumProvider` - Access Ethereum provider

**Network:**
- Base Mainnet (Chain ID: 8453)

## Step 4: Update Environment Variables

Add these to your Vercel deployment:

```
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_SITE_URL=https://your-vercel-url.vercel.app
```

## Step 5: Test Your Mini App

### 5.1 Test in Development Mode

1. In Farcaster Developer Portal, set your app to "Development" mode
2. Share the test link with yourself
3. Open the link in Farcaster
4. Test all features:
   - ✅ Wallet connection
   - ✅ Balance queries
   - ✅ Portfolio view
   - ✅ Chat interface
   - ✅ Navigation

### 5.2 Test on Mobile

1. Open Farcaster on your mobile device
2. Navigate to your Mini App
3. Test on mobile view:
   - ✅ Responsive design
   - ✅ Touch interactions
   - ✅ Mobile navigation

## Step 6: Submit for Review

Once testing is complete:

1. Go to Farcaster Developer Portal
2. Click "Submit for Review"
3. Fill out the review form:
   - Describe your app's purpose
   - Explain key features
   - Provide testing notes
4. Submit for approval

**Review Process:**
- Typically takes 1-3 business days
- Farcaster team will test your app
- You'll receive feedback via email

## Step 7: Launch Your Mini App

After approval:

1. Set your app to "Production" mode
2. Your app will be discoverable in Farcaster
3. Share your app with users
4. Monitor usage and feedback

## Important Files for Farcaster

### 1. `/public/manifest.json`
Defines your app's metadata (already created)

### 2. `/public/llm.txt`
Provides context for Farcaster's AI (already created)

### 3. `/public/icon-*.png`
App icons (you need to create these)

### 4. `/public/screenshot-*.png`
App screenshots (you need to create these)

## Troubleshooting

### App Not Loading in Farcaster

**Check:**
- ✅ App is deployed and accessible
- ✅ HTTPS is enabled (required)
- ✅ CORS is configured correctly
- ✅ Manifest.json is accessible

**Test:**
```bash
curl https://your-app.vercel.app/manifest.json
curl https://your-app.vercel.app/llm.txt
```

### Wallet Not Connecting

**Check:**
- ✅ Farcaster SDK is initialized correctly
- ✅ Wallet permissions are enabled
- ✅ Network is set to Base (8453)

### API Errors

**Check:**
- ✅ Environment variables are set in Vercel
- ✅ OpenAI API key is valid
- ✅ API routes are accessible

## Security Best Practices

1. **Never expose API keys in client code**
   - Use environment variables
   - Keep API keys server-side

2. **Validate all user inputs**
   - Sanitize addresses
   - Check amounts before transactions

3. **Use HTTPS only**
   - Required for Farcaster Mini Apps
   - Never use HTTP in production

4. **Implement rate limiting**
   - Prevent API abuse
   - Use Vercel's built-in rate limiting

## Monitoring & Analytics

### Vercel Analytics

Enable Vercel Analytics in your dashboard:
1. Go to Vercel Dashboard
2. Select your project
3. Enable Analytics
4. Monitor performance

### Error Tracking

Consider adding error tracking:
- Sentry
- LogRocket
- Rollbar

## Support & Updates

### Updating Your App

1. Make changes locally
2. Test thoroughly
3. Push to GitHub
4. Vercel auto-deploys
5. Test in Farcaster again

### User Support

Provide support through:
- Farcaster channel
- Email support
- Help page in app
- Documentation

## Resources

- [Farcaster Documentation](https://docs.farcaster.xyz/)
- [Farcaster Mini Apps Guide](https://docs.farcaster.xyz/mini-apps)
- [Base Network Docs](https://docs.base.org/)
- [Vercel Documentation](https://vercel.com/docs)

## Checklist

Before submitting to Farcaster:

- [ ] App deployed to Vercel
- [ ] All environment variables set
- [ ] Icons created and uploaded
- [ ] Screenshots created and uploaded
- [ ] manifest.json accessible
- [ ] llm.txt accessible
- [ ] Wallet integration working
- [ ] All features tested
- [ ] Mobile responsive
- [ ] HTTPS enabled
- [ ] Error handling implemented
- [ ] Documentation complete

## Next Steps

After deployment:

1. Share your Mini App with early users
2. Gather feedback
3. Iterate and improve
4. Add more features
5. Build your user base

---

**Need Help?** Check the troubleshooting section or reach out to the Farcaster community.

**Good luck with your deployment! 🚀**

