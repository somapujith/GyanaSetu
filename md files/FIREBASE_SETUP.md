# Firebase Setup Guide for Gyana Setu

This guide will walk you through setting up Firebase for the Campus Resource Sharing Platform.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name: `gyana-setu` (or any name)
4. Click "Continue"
5. Disable Google Analytics (optional, for faster setup)
6. Click "Create Project"
7. Wait for project to be created

## Step 2: Enable Authentication

1. In Firebase Console, go to **Build** → **Authentication**
2. Click **Get Started**
3. Select **Email/Password** provider
4. Toggle **Enable**
5. Click **Save**

## Step 3: Create Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click **Create Database**
3. Choose **Start in test mode** (for development)
4. Select region closest to you (e.g., `us-central1`)
5. Click **Create**

## Step 4: Enable Cloud Storage

1. In Firebase Console, go to **Build** → **Storage**
2. Click **Get Started**
3. Start in test mode (default)
4. Select default location
5. Click **Done**

## Step 5: Get Firebase Credentials

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to **Your apps** section
3. Click **Web** icon to register a web app
4. Name your app: `gyana-setu-web`
5. Copy the Firebase config object

Your config will look like:
```javascript
{
  apiKey: "AIzaSy...",
  authDomain: "gyana-setu.firebaseapp.com",
  projectId: "gyana-setu",
  storageBucket: "gyana-setu.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
}
```

## Step 6: Configure Environment Variables

1. In your project root, create a `.env` file (if not exists)
2. Add your Firebase credentials:

```bash
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=gyana-setu.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=gyana-setu
VITE_FIREBASE_STORAGE_BUCKET=gyana-setu.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

## Step 7: Create Firestore Collections

Go to **Firestore Database** and create these collections:

### Collection 1: `users`

Create collection named `users` with sample document:

```json
{
  "uid": "user123",
  "email": "student@example.com",
  "fullName": "John Doe",
  "college": "IIIT Hyderabad",
  "createdAt": "2025-01-10T10:30:00Z",
  "avatar": "",
  "bio": ""
}
```

### Collection 2: `resources`

Create collection named `resources` with sample document:

```json
{
  "id": "res123",
  "userId": "user123",
  "userName": "John Doe",
  "userEmail": "student@example.com",
  "college": "IIIT Hyderabad",
  "title": "Data Structures - Thomas Cormen",
  "description": "Used textbook in good condition. Perfect for competitive programming preparation.",
  "category": "books",
  "condition": "good",
  "location": "IIIT Library - 2nd Floor",
  "image": "https://example.com/book.jpg",
  "availableFrom": "2025-01-10",
  "availableTo": "2025-03-10",
  "status": "available",
  "requests": [
    {
      "userId": "user456",
      "message": "I need this book for my DSA course",
      "createdAt": "2025-01-09T15:20:00Z",
      "status": "pending"
    }
  ],
  "createdAt": "2025-01-08T09:00:00Z"
}
```

## Step 8: Set Firestore Security Rules

For **development**, go to **Firestore Database** → **Rules** and use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read for resources
    match /resources/{document=**} {
      allow read: if true;
      allow create: if request.auth.uid != null;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }
    
    // Allow users to read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

For **production**, add more restrictive rules based on your needs.

## Step 9: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open `http://localhost:5173/` in your browser

3. Try to:
   - Sign up with a new account
   - Create a resource
   - View resources on dashboard
   - Request a resource

If everything works, your Firebase setup is complete! ✅

## Troubleshooting

### Error: "Firebase is not configured"
- Check your `.env` file has all Firebase credentials
- Restart the development server after adding `.env`
- Make sure `src/config/firebase.js` is importing correctly

### Error: "Permission denied" when creating resources
- Check Firestore security rules
- Make sure authentication is enabled
- Verify user is logged in before posting

### Error: "CORS or 403 Forbidden"
- Check that Firestore database rules allow reads/writes
- Verify Firebase project is active
- Check that authentication is properly configured

### Firestore data not appearing
- Make sure documents are in the correct collections
- Check collection and field names match exactly
- Verify user ID is properly stored in documents

### Images not loading
- Use full HTTPS URLs for image paths
- Check that Cloud Storage is enabled
- Images must be publicly accessible or properly authenticated

## Firebase Pricing

**Good news**: Firebase has a generous free tier:

- **Authentication**: 50,000 user logins/month free
- **Firestore**: 1 GB storage, 50k reads, 20k writes, 20k deletes/day free
- **Cloud Storage**: 5 GB storage free
- **Functions**: 2 million invocations/month free

This is more than enough for MVP and small deployments!

## Next Steps

1. ✅ Firebase project created
2. ✅ Services enabled (Auth, Firestore, Storage)
3. ✅ Collections created
4. ✅ Environment variables configured
5. ✅ Security rules set
6. Start building and testing!

## Helpful Links

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [Cloud Storage Docs](https://firebase.google.com/docs/storage)
- [Security Rules Guide](https://firebase.google.com/docs/firestore/security/start)

---

**Note**: Keep your Firebase credentials secret. Never commit `.env` file to version control. Add `.env` to `.gitignore`.
