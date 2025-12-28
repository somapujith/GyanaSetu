# 🔥 Firebase Setup - Complete Automation Guide

Your Firebase setup is now automated! Follow these steps:

---

## ⚡ Quick Setup (5 minutes)

### Step 1: Initialize Firebase Project (One-time)

```bash
npm run firebase:init
```

This will:
1. Ask you to log in to your Firebase account
2. Select your project: `gyana-setu`
3. Set up the `.firebaserc` configuration file

**When prompted:**
- ❓ **What do you want to set up?** → Select `Firestore Database` and `Firestore Rules`
- ❓ **Which Firebase features do you want?** → Press space to select, then Enter
- ❓ **Select a default Firebase project** → Select `gyana-setu`

---

### Step 2: Deploy Security Rules

```bash
npm run firebase:deploy-rules
```

This will automatically:
- ✅ Read your `firestore.rules` file
- ✅ Deploy security rules to Firebase Console
- ✅ Create collections: `users` and `resources`

**Expected output:**
```
✔ Firestore Rules have been successfully deployed
```

---

### Step 3: Create Sample Data

```bash
npm run firebase:setup
```

This will:
- ✅ Create 2 test student accounts
- ✅ Create 2 sample resources
- ✅ Print login credentials

**Expected output:**
```
✅ Created: student1@college.com
✅ Created: student2@college.com
✅ Created: "Data Structures Book" 
✅ Created: "Laptop Stand Metal"

📋 Test Accounts:
   Email: student1@college.com
   Password: student123
```

---

## ✅ Verify Setup Works

### Step 1: Start Dev Server

```bash
npm run dev
```

Open: http://localhost:5173/

### Step 2: Test Student Login

1. Click **"Get Started"**
2. Click **"Student Login"** (or go to `/student-login`)
3. Enter:
   - Email: `student1@college.com`
   - Password: `student123`
4. Click **"Sign In"**

**Expected:**
- ✅ No errors
- ✅ Redirected to Student Dashboard
- ✅ See 2 sample resources

### Step 3: Test Admin Login

1. Go to `/admin-login`
2. Enter:
   - Email: `admin@gyanasetu.com`
   - Password: `adminpass123`
   - Code: `ADMIN2025`
3. Click **"Login as Admin"**

**Expected:**
- ⚠️ Error: "Invalid email or password" (this is normal - no admin account exists yet)

---

## 🛠️ Manual Admin Account Creation

If you want to create an admin account for real testing:

### Option A: Firebase Console (Easiest)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `gyana-setu`
3. Go to **Build** → **Authentication** → **Users** tab
4. Click **"Add User"**
5. Enter:
   - Email: `admin@gyanasetu.com`
   - Password: `adminpass123`
6. Click **"Add User"**
7. Copy the User ID

Then create the user profile in Firestore:

1. Go to **Build** → **Firestore Database**
2. Click **"Start collection"**
3. Name: `users`
4. Document ID: (paste the User ID you copied)
5. Add fields:
   ```
   uid: (paste User ID)
   email: admin@gyanasetu.com
   fullName: Admin
   role: admin
   college: Gyana Setu Admin
   createdAt: (timestamp)
   ```
6. Click **"Save"**

Now you can login as admin with:
- Email: `admin@gyanasetu.com`
- Password: `adminpass123`
- Code: `ADMIN2025`

### Option B: Node Script (Advanced)

Create `scripts/createAdmin.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdmin() {
  try {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      'admin@gyanasetu.com',
      'adminpass123'
    );
    
    await setDoc(doc(db, 'users', userCred.user.uid), {
      uid: userCred.user.uid,
      email: 'admin@gyanasetu.com',
      fullName: 'Admin',
      role: 'admin',
      college: 'Gyana Setu Admin',
      createdAt: Timestamp.now(),
    });
    
    console.log('✅ Admin created!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
```

Run:
```bash
node scripts/createAdmin.js
```

---

## 📊 What Gets Created

### Collections Created

#### 1. `users` collection
```json
{
  "uid": "abc123xyz",
  "email": "student1@college.com",
  "fullName": "Raj Kumar",
  "college": "IIIT Hyderabad",
  "rollNo": "20BCS001",
  "role": "student",
  "avatar": "",
  "bio": "",
  "createdAt": "2025-01-10T10:30:00Z"
}
```

#### 2. `resources` collection
```json
{
  "title": "Data Structures & Algorithms Book",
  "description": "Used textbook in great condition...",
  "category": "books",
  "condition": "good",
  "college": "IIIT Hyderabad",
  "location": "IIIT Library - 2nd Floor",
  "userId": "abc123xyz",
  "userName": "Raj Kumar",
  "userEmail": "student1@college.com",
  "status": "available",
  "requests": [],
  "createdAt": "2025-01-10T10:30:00Z"
}
```

### Security Rules Deployed

```javascript
// Public can read resources
// Authenticated users can post resources
// Only resource owners can edit/delete
// Users can only access their own profile
```

---

## 🎯 Complete Workflow

```
1. npm run firebase:init          ← Initialize Firebase CLI
2. npm run firebase:deploy-rules  ← Deploy Firestore rules
3. npm run firebase:setup         ← Create sample data
4. npm run dev                    ← Start dev server
5. Test at http://localhost:5173/
```

---

## 📋 Troubleshooting

### Error: "Firebase CLI not found"
```bash
npm install -g firebase-tools
firebase --version
```

### Error: "Not authenticated"
```bash
firebase login
firebase login --reauth
```

### Error: "Project not found"
```bash
firebase projects:list
firebase use gyana-setu
```

### Error: "Permission denied" when deploying rules
```bash
firebase projects:list
# Make sure you're in the right project
firebase use gyana-setu
firebase deploy --only firestore:rules
```

### Collections not created
```bash
# Check Firebase Console manually
# Go to: Firestore Database → Collections tab
# You should see "users" and "resources"
# If not, run: npm run firebase:setup
```

### Login not working
1. Check `.env` file exists with credentials
2. Restart dev server: `npm run dev`
3. Check browser console (F12) for errors
4. Verify account exists in Firebase Console → Authentication

---

## ✨ What's Now Working

✅ **Student Registration** - Creates account + Firestore profile  
✅ **Student Login** - Authenticates and loads dashboard  
✅ **Student Dashboard** - Shows sample resources  
✅ **Resource Posting** - Creates new resources  
✅ **Admin Login** - Authenticates with role verification  
✅ **Admin Dashboard** - Shows management panels  
✅ **Security Rules** - Protects data properly  

---

## 🚀 Next Steps

1. **Test more thoroughly:**
   - Create multiple accounts
   - Post more resources
   - Test all dashboard features

2. **Customize:**
   - Change test account credentials
   - Add more sample resources
   - Modify admin code (currently `ADMIN2025`)

3. **Deploy to Production:**
   - See [DEPLOYMENT.md](DEPLOYMENT.md)
   - Run: `npm run build && firebase deploy`

---

## 📞 Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run firebase:init` | Initialize Firebase CLI |
| `npm run firebase:deploy-rules` | Deploy security rules |
| `npm run firebase:setup` | Create sample data |
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `firebase login` | Authenticate with Google |
| `firebase projects:list` | List all Firebase projects |
| `firebase deploy` | Deploy everything |

---

## ✅ Success Checklist

- [ ] `npm run firebase:init` completed without errors
- [ ] `npm run firebase:deploy-rules` shows "successfully deployed"
- [ ] `npm run firebase:setup` creates test accounts
- [ ] Dev server starts: `npm run dev`
- [ ] Can login as student1@college.com / student123
- [ ] Student Dashboard shows resources
- [ ] Resources appear in Firestore Database
- [ ] Security rules deployed in Firebase Console

---

**You're all set!** 🎉

Run: `npm run dev` and visit http://localhost:5173/ to test!
