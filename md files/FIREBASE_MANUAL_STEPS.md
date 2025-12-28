# ⚠️ Manual Firebase Setup Required

Since Firebase CLI authentication requires browser interaction, you'll need to complete the setup manually through the Firebase Console. Don't worry - it's just a few clicks!

## 🔑 Step 1: Authenticate Firebase CLI (Required)

Open your terminal and run:

```bash
firebase login
```

This will:
1. Open your browser automatically
2. Ask you to sign in with your Google account
3. Grant permission to Firebase CLI
4. Return to terminal with confirmation

---

## 📋 Step 2: Manual Firestore Setup (Firebase Console)

Since you can't interact with the CLI prompts right now, set up Firestore manually:

### Create Collections

1. **Go to Firebase Console:**
   - URL: https://console.firebase.google.com/
   - Select project: `gyana-setu`

2. **Create `users` collection:**
   - Click **Firestore Database**
   - Click **Create Collection**
   - Name: `users`
   - Click **Create**

3. **Create `resources` collection:**
   - Click **Create Collection**
   - Name: `resources`  
   - Click **Create**

### Deploy Security Rules

1. **Go to Firestore Rules:**
   - Click **Rules** tab (in Firestore Database)
   - Delete the default rules
   - Paste this code:

```javascript
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
    
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

2. Click **Publish**

---

## ✅ Step 3: Create Sample Data with Script

Once Firebase authentication is done, run:

```bash
npm run firebase:setup
```

This will automatically create:
- ✅ 2 test student accounts
- ✅ 2 sample resources
- ✅ Print login credentials

---

## 🧪 Step 4: Test Everything

### Start dev server:
```bash
npm run dev
```

### Open browser:
```
http://localhost:5173/
```

### Test student login:
- Email: `student1@college.com`
- Password: `student123`

---

## 📱 Full Setup Checklist

- [ ] Run `firebase login` and complete browser authentication
- [ ] Create `users` collection in Firestore
- [ ] Create `resources` collection in Firestore
- [ ] Deploy security rules (copy-paste code above)
- [ ] Run `npm run firebase:setup` to create sample data
- [ ] Run `npm run dev` to start dev server
- [ ] Test login at http://localhost:5173/student-login

---

## 💡 Helpful Commands After Login

Once `firebase login` works:

```bash
# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Deploy everything
firebase deploy

# Check your projects
firebase projects:list

# Set default project
firebase use gyana-setu
```

---

**Next Action:** Run `firebase login` in your terminal, then come back when authentication completes!
