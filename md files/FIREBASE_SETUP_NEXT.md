# 🚀 Firebase Setup - Next Steps

## ✅ Completed

1. ✅ Firebase project created (`gyana-setu`)
2. ✅ Firebase credentials obtained
3. ✅ `.env` file created with credentials
4. ✅ Firebase CLI tools installed (v15.1.0)

---

## 📋 Next Steps

### Step 1: Set Firestore Security Rules

Your Firebase project needs security rules to protect data. Follow these steps:

1. **Go to Firebase Console**
   - URL: https://console.firebase.google.com/
   - Select project: `gyana-setu`

2. **Navigate to Firestore Rules**
   - Left sidebar → **Build** → **Firestore Database**
   - Click **Rules** tab at top

3. **Replace with Development Rules**

Copy and paste this (good for development):

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

4. **Click "Publish"**

---

### Step 2: Enable Email/Password Authentication

1. **Go to Firebase Console**
   - Select project: `gyana-setu`

2. **Navigate to Authentication**
   - Left sidebar → **Build** → **Authentication**

3. **Check Email/Password is Enabled**
   - You should see it in the Sign-in providers list
   - If not, click **Email/Password** and enable it

4. **Verify Settings**
   - Email enumeration protection: enabled
   - Password reset: enabled

---

### Step 3: Test Firebase Connection

Run your dev server and test:

```bash
npm run dev
```

Then:
1. Visit http://localhost:5173/
2. Click "Get Started"
3. Go to **Student Signup** (`/student-signup`)
4. Fill in the form:
   - Full Name: `Test Student`
   - Email: `test.student@college.edu`
   - College: Select any
   - Roll No: `20BCS001`
   - Password: `test123456`
   - Confirm: `test123456`
5. Click **Sign Up**

**Expected Result:**
- ✅ Account created
- ✅ Redirected to Student Dashboard
- ✅ No errors in browser console
- ✅ User appears in Firebase Console → Authentication

---

### Step 4: Verify in Firebase Console

After signing up, check:

1. **Authentication Users**
   - Go to **Build** → **Authentication**
   - You should see your test account with email: `test.student@college.edu`

2. **Firestore Database**
   - Go to **Build** → **Firestore Database**
   - Look for `users` collection
   - You should see a document with your user data

---

### Step 5: Test Admin Login

1. **Go to Admin Login** (`/admin-login`)
2. **Enter:**
   - Email: `admin@gyanasetu.com`
   - Password: `adminpass123`
   - Code: `ADMIN2025`
3. **Click "Login as Admin"**

**Expected Result:**
- ✅ Error: "Invalid email or password"
- This is expected! No admin user exists yet.

---

### Step 6: Create Admin User (Manual)

To create an admin account:

**Option A: Using Firebase Console**

1. Go to **Authentication** → **Users** tab
2. Click **Add User**
3. Enter:
   - Email: `admin@gyanasetu.com`
   - Password: `adminpass123`
4. Click **Add User**

Then:
1. Go to **Firestore Database**
2. Click **Start collection**
3. Name: `users`
4. Add first document with ID: `(admin user ID from Authentication)`
5. Set fields:
   ```
   uid: "(copy from auth)"
   email: "admin@gyanasetu.com"
   fullName: "Admin"
   role: "admin"
   createdAt: (current timestamp)
   ```

**Option B: Using Code**

Create a file `scripts/createAdmin.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCpfqChmUZcyeUhZ-SyYGxt-cnmQPmsuYg",
  authDomain: "gyana-setu.firebaseapp.com",
  projectId: "gyana-setu",
  storageBucket: "gyana-setu.firebasestorage.app",
  messagingSenderId: "321099112394",
  appId: "1:321099112394:web:7164536c9d7c0fd8edf933"
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
      createdAt: new Date().toISOString()
    });
    
    console.log('Admin created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createAdmin();
```

Run with:
```bash
node scripts/createAdmin.js
```

---

### Step 7: Test Complete Flow

**Student Flow:**
1. ✅ Go to `/student-login`
2. ✅ Click "Sign up as Student"
3. ✅ Fill form and register
4. ✅ See Student Dashboard

**Admin Flow:**
1. ✅ Go to `/admin-login`
2. ✅ Enter admin credentials
3. ✅ Enter admin code: `ADMIN2025`
4. ✅ See Admin Dashboard

**Resource Posting:**
1. ✅ From Student Dashboard, click "➕ Share Resource"
2. ✅ Fill resource form
3. ✅ Submit
4. ✅ See resource in dashboard

---

## 🎯 Quick Checklist

After each step, verify:

- [ ] Firebase credentials in `.env` file
- [ ] Firestore Security Rules published
- [ ] Email/Password authentication enabled
- [ ] Can sign up as student
- [ ] User appears in Firebase Authentication
- [ ] User profile in Firestore `users` collection
- [ ] Admin user created
- [ ] Can login as admin
- [ ] Student Dashboard loads
- [ ] Admin Dashboard loads
- [ ] Can post resources
- [ ] Resources appear in database

---

## 🐛 Troubleshooting

### "Firebase is not configured"
```
Solution:
1. Check .env file exists with all credentials
2. Restart dev server (npm run dev)
3. Check browser console for errors
4. Verify firebase.js imports correctly
```

### "Permission denied" error
```
Solution:
1. Check Firestore Security Rules are published
2. Ensure user is authenticated
3. Verify collection names match (users, resources)
4. Check database is in test mode (for development)
```

### "Auth/user-not-found"
```
Solution:
1. Make sure user exists in Firebase Authentication
2. Create user via Firebase Console or sign up page
3. Check email is spelled correctly
```

### Firestore collections empty
```
Solution:
1. Ensure documents were created with correct names
2. Check collection is named exactly: "users" or "resources"
3. Verify Firebase project is correct (gyana-setu)
4. Check Firestore is in test mode for development
```

---

## 📊 Firebase Services Status

Check in Firebase Console → Project Overview:

| Service | Status | Expected |
|---------|--------|----------|
| Authentication | Active | ✅ Enabled |
| Firestore | Active | ✅ Test mode |
| Cloud Storage | Active | ✅ Test mode |

---

## 🔐 Security Notes

For **Development** (what you have now):
- ✅ Test mode allows all reads/writes
- ✅ Good for building and testing
- ⚠️ NOT secure for production

For **Production**:
- ❌ Never use test mode
- ✅ Use strict security rules
- ✅ Require authentication
- ✅ Validate user roles

---

## 📚 Helpful Commands

**Start dev server:**
```bash
npm run dev
```

**Deploy to Firebase Hosting (later):**
```bash
firebase init hosting
firebase deploy
```

**View Firebase logs:**
```bash
firebase functions:log
```

**View Firestore usage:**
- Go to Firebase Console → Firestore Database → Usage

---

## 🎯 What's Next

After verifying everything works:

1. **Test with multiple accounts** - Create 3-4 test accounts
2. **Test resource posting** - Create and browse resources
3. **Test admin features** - View dashboards, manage resources
4. **Customize** - Change admin code, add features
5. **Deploy** - Follow [DEPLOYMENT.md](DEPLOYMENT.md)

---

## ✅ Success Indicators

Your setup is complete when:

✅ `npm run dev` runs without errors  
✅ http://localhost:5173/ loads  
✅ Can sign up as student  
✅ Account appears in Firebase  
✅ Can login as student  
✅ Student Dashboard works  
✅ Can login as admin  
✅ Admin Dashboard works  
✅ Can post resources  
✅ Resources appear in Firestore  

---

## 📞 Support

If you get stuck:

1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Check Firebase Console for errors
3. Check browser Console (F12)
4. Review [ADMIN_STUDENT_AUTH.md](ADMIN_STUDENT_AUTH.md)

---

**Status:** Firebase configured and ready! 🚀

**Next Action:** Set Firestore Security Rules (Step 1 above)
