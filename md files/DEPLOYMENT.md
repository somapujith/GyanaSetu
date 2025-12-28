# 🚀 Gyana Setu - Deployment Guide

This guide shows how to deploy your Campus Resource Sharing Platform to production.

---

## Deployment Options

### Option 1: Firebase Hosting ⭐ (Recommended)
- Free tier available
- Integrated with Firebase
- HTTPS by default
- CDN included
- Easy deployment

### Option 2: Vercel
- Zero-config deployment
- GitHub integration
- Preview URLs
- Fast builds

### Option 3: Netlify
- Drag and drop deployment
- GitHub integration
- Free tier
- Functions support

### Option 4: Traditional Hosting
- Any Node.js host
- Docker deployment
- More control

---

## Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] Environment variables set correctly
- [ ] Firebase production rules configured
- [ ] Build passes without errors (`npm run build`)
- [ ] No console errors or warnings
- [ ] Database and auth fully functional
- [ ] Images and assets loading correctly
- [ ] Responsive design tested on mobile
- [ ] Form validation working
- [ ] Error handling in place

---

## Option 1: Deploy to Firebase Hosting

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

This will open a browser for authentication.

### Step 3: Initialize Firebase Project

```bash
firebase init hosting
```

During setup:
- Select your Firebase project
- Set public directory to: `dist`
- Configure single-page app: `Yes` (choose yes)
- Don't overwrite index.html

### Step 4: Build the Project

```bash
npm run build
```

This creates the `dist` folder with optimized code.

### Step 5: Deploy

```bash
firebase deploy
```

You'll get a URL like: `https://your-project.web.app`

### Step 6: Configure Custom Domain (Optional)

In Firebase Console:
1. Go to **Hosting**
2. Click **Add Custom Domain**
3. Follow the domain setup instructions

---

## Option 2: Deploy to Vercel

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Deploy

```bash
vercel
```

### Step 3: Configuration

Answer the prompts:
- Link to existing project? `No`
- What's your project name? (choose one)
- In which directory? `./` (root)
- Want to modify vercel.json? `No`

### Step 4: Add Environment Variables

In Vercel Dashboard:
1. Go to Project Settings
2. Go to **Environment Variables**
3. Add your `.env` variables:
   ```
   VITE_FIREBASE_API_KEY
   VITE_FIREBASE_AUTH_DOMAIN
   VITE_FIREBASE_PROJECT_ID
   VITE_FIREBASE_STORAGE_BUCKET
   VITE_FIREBASE_MESSAGING_SENDER_ID
   VITE_FIREBASE_APP_ID
   ```

### Step 5: Deploy Production

```bash
vercel --prod
```

You'll get a production URL.

---

## Option 3: Deploy to Netlify

### Step 1: Login to Netlify

Go to https://netlify.com and sign up/login

### Step 2: Create `.netlify.toml`

Create file in project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 3: Connect GitHub (Recommended)

1. Push your code to GitHub
2. On Netlify, click "New site from Git"
3. Select GitHub repository
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`

### Step 4: Add Environment Variables

In Netlify Dashboard:
1. Go to Site Settings
2. Go to **Build & Deploy** → **Environment**
3. Add your variables from `.env`

### Step 5: Deploy

Netlify will auto-deploy when you push to GitHub!

---

## Option 4: Docker Deployment

### Step 1: Create Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
```

### Step 2: Create .dockerignore

```
node_modules
npm-debug.log
dist
.git
.env
.env.local
```

### Step 3: Build Docker Image

```bash
docker build -t gyana-setu .
```

### Step 4: Run Locally

```bash
docker run -p 3000:3000 \
  -e VITE_FIREBASE_API_KEY=your_key \
  -e VITE_FIREBASE_AUTH_DOMAIN=your_domain \
  gyana-setu
```

### Step 5: Deploy to Cloud

Popular options:
- **Google Cloud Run**: `gcloud run deploy`
- **AWS**: Using ECR and ECS
- **Heroku**: `heroku container:push web && heroku container:release web`
- **DigitalOcean**: App Platform

---

## Production Configuration

### Environment Variables for Production

```bash
# .env.production
VITE_FIREBASE_API_KEY=prod_key
VITE_FIREBASE_AUTH_DOMAIN=prod_domain
VITE_FIREBASE_PROJECT_ID=prod_project_id
VITE_FIREBASE_STORAGE_BUCKET=prod_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=prod_id
VITE_FIREBASE_APP_ID=prod_app_id
```

### Firestore Security Rules (Production)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function isValidResource() {
      return request.resource.data.size() <= 10 &&
             'title' in request.resource.data &&
             'description' in request.resource.data &&
             'userId' in request.resource.data;
    }
    
    match /resources/{resourceId} {
      allow read: if true;
      allow create: if request.auth != null && isValidResource();
      allow update: if isOwner(resource.data.userId) && 
                       request.auth != null && 
                       isValidResource();
      allow delete: if isOwner(resource.data.userId);
    }
    
    match /users/{userId} {
      allow read: if true;
      allow write: if isOwner(userId);
      allow create: if request.auth.uid == userId;
    }
  }
}
```

### Enable SSL/HTTPS

- ✅ Firebase Hosting: Automatic
- ✅ Vercel: Automatic
- ✅ Netlify: Automatic
- ⚠️ Other hosts: Use Let's Encrypt

---

## Performance Optimization for Production

### 1. Build Optimization

```bash
# Create optimized build
npm run build

# Analyze bundle size
npm install -g webpack-bundle-analyzer
# Add to vite.config.js if needed
```

### 2. CDN Configuration

- Images via Cloud Storage CDN
- Use image optimization
- Enable caching headers

### 3. Database Optimization

- Add Firestore indexes
- Implement pagination
- Use query filters wisely

### 4. Monitoring

Enable in Firebase Console:
- Performance Monitoring
- Crash Reporting
- Google Analytics

---

## Database Migration to Production

### Step 1: Export Data (if migrating)

```bash
# Export from development
firebase firestore:export backup/

# Import to production
firebase firestore:import backup/ \
  --project your-production-project
```

### Step 2: Update Security Rules

Apply production rules in Firebase Console → Firestore → Rules

### Step 3: Create Backups

Enable automatic backups in Firebase Console:
1. Go to Firestore Database
2. Click **Backups**
3. Set backup schedule

---

## Monitoring & Analytics

### Google Analytics Setup

1. Enable in Firebase Console
2. Get Measurement ID
3. Add to HTML: `<script async src="https://www.googletagmanager.com/gtag/js?id=G-MEASUREMENT_ID"></script>`
4. Track user behavior

### Error Tracking

Firebase Console → Crashlytics:
- Monitor crashes
- Get alerts for errors
- Analyze error patterns

### Performance Monitoring

Firebase Console → Performance:
- Track page load times
- Monitor database operations
- Identify bottlenecks

---

## Post-Deployment Checklist

- [ ] Domain/URL working
- [ ] HTTPS enabled
- [ ] Firebase auth working
- [ ] Firestore readable/writable
- [ ] Images loading
- [ ] Forms submitting
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Analytics tracking
- [ ] Monitoring active
- [ ] Backups enabled
- [ ] Team notified

---

## Common Deployment Issues

### Issue: Build fails

```bash
# Clear cache and rebuild
npm cache clean --force
rm -rf dist node_modules
npm install
npm run build
```

### Issue: Environment variables not working

- Check variable names exactly match
- Restart build after adding variables
- Use VITE_ prefix for client-side variables
- Check .env file syntax

### Issue: Firestore rules too restrictive

- Use Firestore emulator to test rules
- Check error message in browser console
- Verify user is authenticated
- Review security rule examples

### Issue: Image URLs broken

- Use full HTTPS URLs
- Check Cloud Storage bucket is public (if needed)
- Or implement authentication for images
- Test URLs in browser first

---

## Rollback Procedure

### Firebase Hosting

```bash
# View deployment history
firebase hosting:channels:list

# Rollback to previous
firebase deploy --only hosting --release-channel=main
```

### Vercel

- Automatic previous version available
- Can redeploy from dashboard
- 24-hour rollback window

### Netlify

- Can revert to previous deploy
- Automatic versioning
- Easy one-click rollback

---

## SSL/Certificate Setup

### For Custom Domain

- Firebase: Automatic (Let's Encrypt)
- Vercel: Automatic
- Netlify: Automatic
- Other: Use Certbot or Cloudflare

---

## Scaling Considerations

### Firestore Costs
- Read: $0.06 per 100k
- Write: $0.18 per 100k
- Delete: $0.02 per 100k
- Storage: $0.18 per GB/month

### Optimization Tips
- Use pagination (limit queries)
- Implement caching
- Combine queries efficiently
- Delete old data
- Use composite indexes wisely

---

## Maintenance Schedule

### Daily
- Monitor error logs
- Check uptime

### Weekly
- Review analytics
- Check Firebase quota
- Monitor performance

### Monthly
- Review security rules
- Check backup status
- Plan feature updates

### Quarterly
- Security audit
- Performance review
- Database cleanup
- Cost analysis

---

## Support & Troubleshooting

If deployment fails:

1. Check build output for errors
2. Verify environment variables
3. Test locally with `npm run build && npm run preview`
4. Check Firebase project settings
5. Review deployment provider documentation

---

## Next Steps After Deployment

1. Share deployed URL with team
2. Announce to users
3. Gather feedback
4. Monitor analytics
5. Plan Phase 2 features
6. Continue development

---

**Congratulations! Your app is now live! 🎉**

For more information, see:
- README.md for complete docs
- ARCHITECTURE.md for system design
- TROUBLESHOOTING.md for issues
- Firebase Hosting docs: https://firebase.google.com/docs/hosting

---

**Happy deploying!** 🚀
