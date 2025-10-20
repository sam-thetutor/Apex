# Farcaster Mini App Deployment Checklist

## Pre-Deployment

### Code & Build
- [x] ✅ Code is pushed to GitHub
- [x] ✅ App builds successfully (`npm run build`)
- [x] ✅ All TypeScript errors fixed
- [x] ✅ Environment variables documented
- [x] ✅ `manifest.json` created
- [x] ✅ `llm.txt` created

### Deployment
- [ ] Deploy to Vercel
- [ ] Get Vercel URL
- [ ] Set environment variables in Vercel
- [ ] Test deployed app

### Assets
- [ ] Create `icon-192.png` (192x192px)
- [ ] Create `icon-512.png` (512x512px)
- [ ] Create `screenshot-1.png` (1280x720px)
- [ ] Upload icons to `/public` folder
- [ ] Test icons are accessible

## Farcaster Registration

### Developer Portal
- [ ] Go to Farcaster Developer Portal
- [ ] Log in with Farcaster account
- [ ] Create new Mini App

### App Configuration
- [ ] Set app name: "Apex"
- [ ] Set description
- [ ] Set category: Finance
- [ ] Set app URL (your Vercel URL)
- [ ] Set manifest URL
- [ ] Set LLM context URL
- [ ] Set icon URL
- [ ] Set screenshot URL

### Permissions
- [ ] Enable `wallet` permission
- [ ] Enable `ethereum` permission
- [ ] Enable `user` permission

### Wallet Actions
- [ ] Configure `sendToken` action
- [ ] Configure `swapToken` action
- [ ] Configure `getEthereumProvider` action
- [ ] Set network: Base Mainnet (8453)

## Testing

### Development Mode
- [ ] Set app to development mode
- [ ] Share test link
- [ ] Test wallet connection
- [ ] Test balance queries
- [ ] Test portfolio view
- [ ] Test chat interface
- [ ] Test navigation
- [ ] Test on mobile

### Functionality
- [ ] Wallet connects successfully
- [ ] Balance queries return data
- [ ] Portfolio displays correctly
- [ ] Chat responses work
- [ ] All pages load
- [ ] Responsive design works
- [ ] No console errors

## Submission

### Pre-Submission
- [ ] All features tested
- [ ] No critical bugs
- [ ] App is production-ready
- [ ] Documentation complete

### Submit for Review
- [ ] Fill out review form
- [ ] Describe app purpose
- [ ] List key features
- [ ] Provide testing notes
- [ ] Submit for approval

### Post-Approval
- [ ] Set to production mode
- [ ] App is discoverable
- [ ] Share with users
- [ ] Monitor usage

## Post-Launch

### Monitoring
- [ ] Set up analytics
- [ ] Monitor error logs
- [ ] Track user feedback
- [ ] Monitor performance

### Support
- [ ] Set up support channel
- [ ] Create help documentation
- [ ] Prepare FAQ
- [ ] Set up email support

## Quick Links

- [Farcaster Developer Portal](https://warpcast.com/~/developers)
- [Farcaster Docs](https://docs.farcaster.xyz/)
- [Base Network Docs](https://docs.base.org/)
- [Vercel Dashboard](https://vercel.com/dashboard)

---

**Status:** Ready for deployment ✅

**Next Step:** Deploy to Vercel and create app icons

