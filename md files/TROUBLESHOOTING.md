# Gyana Setu - Troubleshooting Guide

## Common Issues & Solutions

### 🔴 Firebase Issues

#### Issue: "Firebase is not initialized" or "Cannot read property 'auth' of undefined"

**Causes**:
- Missing `.env` file
- Firebase config not loaded
- Typo in `.env` variable names

**Solutions**:
```bash
# 1. Create .env file
cp .env.example .env

# 2. Fill in your Firebase credentials from Firebase Console
# Edit .env and add:
VITE_FIREBASE_API_KEY=your_actual_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
# ... (add all credentials)

# 3. Restart dev server
npm run dev

# 4. Clear browser cache (Ctrl+Shift+Delete)
```

---

#### Issue: "Permission denied" when creating/updating resources

**Causes**:
- Firestore security rules too restrictive
- Not authenticated
- Wrong user UID

**Solutions**:
```javascript
// Go to Firestore Console → Rules
// Use these rules for development:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read
    match /resources/{document=**} {
      allow read: if true;
      allow create: if request.auth.uid != null;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }
    
    // Allow user access to own profile
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

---

#### Issue: Data not appearing in Firestore

**Causes**:
- Collection doesn't exist
- Document structure mismatch
- Firestore database not created

**Solutions**:
1. Go to Firebase Console
2. Select your project
3. Go to **Firestore Database**
4. Manually create collections: `users`, `resources`
5. Add sample documents with correct structure

---

#### Issue: Cannot sign up or login

**Causes**:
- Authentication not enabled in Firebase
- Email already exists
- Password validation failed

**Solutions**:
```bash
# 1. Check Firebase Authentication is enabled
# Firebase Console → Authentication → Sign-in method
# Ensure "Email/Password" is enabled

# 2. Check error message in browser console
# F12 → Console tab → Look for error details

# 3. Try with different email
# Maybe email is already registered

# 4. Ensure password is at least 6 characters
```

---

### 🔴 Application Issues

#### Issue: App won't load, shows blank white page

**Causes**:
- Firebase not initialized
- React Router error
- JS error in browser console

**Solutions**:
```bash
# 1. Check browser console for errors
# Press F12 → Console tab

# 2. Check terminal for build errors
# Look at npm run dev output

# 3. Clear cache and rebuild
rm -r node_modules
npm install
npm run dev

# 4. Check .env file exists and has content
# Should be in project root: .env
```

---

#### Issue: "Cannot find module 'React'" or import errors

**Causes**:
- Dependencies not installed
- Missing package in package.json
- Node version too old

**Solutions**:
```bash
# 1. Reinstall dependencies
npm install

# 2. Check Node version
node --version
# Should be 14.0 or higher

# 3. Clear npm cache
npm cache clean --force
npm install

# 4. Check if modules exist
ls node_modules/react
```

---

#### Issue: Routes not working, always shows home page

**Causes**:
- React Router not imported
- BrowserRouter not wrapping app
- Route path typo

**Solutions**:
1. Check `App.jsx` has Router wrapped around Routes
2. Verify route paths match what you're trying to access
3. Check browser URL matches defined routes

---

#### Issue: Form submission not working

**Causes**:
- Zustand store not connected
- Firebase not initialized
- Form validation failing silently

**Solutions**:
```bash
# 1. Check browser console (F12 → Console)
# Look for error messages

# 2. Check Firestore rules allow writes
# See Firebase Issues section above

# 3. Verify form has all required fields
# Check validation in page component

# 4. Check network tab (F12 → Network)
# Look for failed Firebase requests
```

---

### 🔴 Styling Issues

#### Issue: Styles not applying, everything looks plain

**Causes**:
- CSS files not imported
- CSS file path wrong
- Build issue with CSS

**Solutions**:
```bash
# 1. Check CSS imports in components
# Should have: import '../styles/filename.css'

# 2. Verify CSS files exist
# Check src/styles/ folder has all CSS files

# 3. Restart dev server
npm run dev

# 4. Clear browser cache
# Ctrl+Shift+Delete in Chrome
```

---

#### Issue: Animations not playing

**Causes**:
- GSAP not loaded
- useLoaderAnimation hook not called
- Three.js not loaded properly

**Solutions**:
```bash
# 1. Check GSAP is imported
# Should have: import gsap from 'gsap'

# 2. Check useLoaderAnimation is called
# In Home.jsx: useLoaderAnimation()

# 3. Check Silk component renders
# Check no console errors about Three.js

# 4. Ensure browser hardware acceleration enabled
# Chrome Settings → Advanced → Use hardware acceleration
```

---

### 🔴 Performance Issues

#### Issue: App is slow, UI freezes

**Causes**:
- Too many re-renders
- Large resources list
- Network request timeout

**Solutions**:
```bash
# 1. Check Chrome DevTools Performance tab
# F12 → Performance → Record

# 2. Limit resources displayed (add pagination)
# Currently showing all resources

# 3. Check network tab for slow requests
# F12 → Network

# 4. Optimize images
# Ensure image URLs are valid and fast

# 5. Check Firestore indexes
# Firebase Console → Firestore → Indexes
```

---

#### Issue: Dashboard very slow to load

**Causes**:
- Fetching too much data
- Firestore query inefficient
- Images not optimized

**Solutions**:
```javascript
// In resourceStore.js, optimize query:
// Add limit to initial query
const q = query(
  collection(db, 'resources'),
  orderBy('createdAt', 'desc'),
  limit(20)  // Add this to limit results
);
```

---

### 🔴 Database Issues

#### Issue: Resources not saving to Firestore

**Causes**:
- Security rules too restrictive
- Document structure wrong
- Firestore not initialized

**Solutions**:
1. Check Firestore rules (see Firebase Issues above)
2. Verify document has all required fields
3. Check browser console for error
4. Try manually adding document in Firebase Console first

---

#### Issue: Can't see newly created resources

**Causes**:
- Resources not refreshing
- Filter hiding new resources
- New resource in different college

**Solutions**:
```bash
# 1. Refresh page (F5)

# 2. Reset filters
# Click "Reset Filters" button in sidebar

# 3. Check if new resource visible with no filters

# 4. Go to Firestore Console and manually check
# If document exists there, issue is with app logic

# 5. Check new resource college matches filter
```

---

### 🔴 Authentication Issues

#### Issue: User not logged in after refresh

**Causes**:
- Auth state not persisting
- Cookie/localStorage issue
- Firebase session expired

**Solutions**:
```javascript
// This should be in authStore.js:
useEffect(() => {
  initAuth(); // This persists session
}, []);

// If not working, check:
// 1. localStorage not disabled in browser
// 2. Browser privacy mode (disables storage)
// 3. Firebase config correct
```

---

#### Issue: Can't logout

**Causes**:
- Logout function not called
- Error in logout method
- Auth state not clearing

**Solutions**:
```bash
# 1. Check browser console for errors

# 2. Verify logout button is connected
# Should call: authStore.logout()

# 3. Check Firestore rules allow logout
# (Logout doesn't need Firestore access)

# 4. Try manually clearing localStorage
# Open DevTools → Application → Storage → Clear All
```

---

### 🔴 Network Issues

#### Issue: CORS error: "Access to XMLHttpRequest blocked"

**Causes**:
- Firebase domain not allowed
- Browser security issue
- Proxy configuration needed

**Solutions**:
```bash
# 1. This shouldn't happen with Firebase
# But if it does, check:

# 2. Firebase config is correct
# Check domain in VITE_FIREBASE_AUTH_DOMAIN

# 3. For local testing, use localhost
# Not external IP

# 4. Check browser extensions blocking
# Try incognito mode
```

---

#### Issue: Requests timing out or taking forever

**Causes**:
- Firestore overloaded
- Network connection slow
- Large query

**Solutions**:
```bash
# 1. Check internet connection
# Open https://google.com

# 2. Check Firestore quota
# Firebase Console → Firestore → Overview

# 3. Optimize query with filters/limits
# Don't fetch all resources

# 4. Check browser network throttling
# F12 → Network → "No throttling" selected
```

---

## Debugging Checklist

### When something breaks, follow this order:

- [ ] Check browser console (F12)
  - Look for red errors
  - Read error message carefully
  - Check stack trace

- [ ] Check terminal/console
  - Look for build errors
  - Check npm output
  - Note any warnings

- [ ] Check network tab (F12 → Network)
  - Look for failed requests
  - Check Firebase API calls
  - Verify response status

- [ ] Check browser cache
  - Clear cache (Ctrl+Shift+Delete)
  - Hard refresh (Ctrl+Shift+R)
  - Try incognito mode

- [ ] Check .env file
  - File exists in root
  - All variables filled
  - Dev server restarted

- [ ] Check Firebase Console
  - Project selected
  - Services enabled
  - Collections exist
  - Rules correct

---

## Getting Help

### Resources:
1. **Browser Console** (F12) - Best first source
2. **Project Documentation** - README.md, QUICKSTART.md
3. **Firebase Console** - Check database, auth, rules
4. **Terminal Output** - npm errors are helpful
5. **Browser Network Tab** - See what's happening

### Copy-paste error message and check:
1. Google the error
2. Search Firebase docs
3. Check Firebase Console
4. Review code around error location

---

## Advanced Debugging

### Enable verbose logging:

```javascript
// Add to firebase.js
import { enableLogging } from 'firebase/firestore';
enableLogging(true); // Enable Firestore logging

// Check browser console for detailed logs
```

### React DevTools:

```bash
# Install React DevTools Chrome extension
# Inspect component state and props
# F12 → Components tab
```

### Firebase Emulator (for testing):

```bash
# Optional: Use Firebase Local Emulator
firebase init emulators
firebase emulators:start
# Connect to local Firebase
```

---

## When All Else Fails

```bash
# 1. Fresh start
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm run dev

# 2. Check Node version
node --version

# 3. Delete .env and recreate
rm .env
cp .env.example .env
# Fill in credentials again

# 4. Restart everything
# Close terminal, close browser, close IDE
# Open fresh terminal, run npm run dev again

# 5. Check system resources
# Restart computer if still failing
```

---

## Common Firestore Security Rule Issues

```javascript
// ❌ TOO RESTRICTIVE
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}

// ✅ GOOD FOR DEVELOPMENT
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /resources/{document=**} {
      allow read: if true;
      allow create: if request.auth.uid != null;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}

// ✅ GOOD FOR PRODUCTION (More restrictive)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    match /resources/{resourceId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if isOwner(resource.data.userId) && request.auth != null;
      allow delete: if isOwner(resource.data.userId) && request.auth != null;
    }
    
    match /users/{userId} {
      allow read: if true;
      allow write: if isOwner(userId);
    }
  }
}
```

---

## Still Having Issues?

1. **Read the error message carefully** - It usually explains the problem
2. **Check the documentation** - README.md has detailed info
3. **Look at similar projects** - See how others solved it
4. **Try a different browser** - Rules out browser-specific issues
5. **Ask for help** - But provide error messages and what you tried

---

**Remember**: Most issues can be solved by:
1. Reading the error message
2. Checking the console
3. Verifying Firebase setup
4. Restarting the server

Good luck! 🚀
