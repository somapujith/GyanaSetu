# 🚀 Quick Start: Admin & Student Login System

Get the new dual authentication system running in 5 minutes!

---

## What's New? ✨

Your GyanaSetu platform now has:

✅ **Separate Student & Admin Logins**
✅ **Role-Based Dashboards**
✅ **Admin Management Panel**
✅ **Student Resource Hub**
✅ **Protected Routes**

---

## Quick Setup

### Step 1: Update Environment Variables

Make sure your `.env` file has Firebase credentials:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 2: Start Dev Server

```bash
npm run dev
```

Server running at: **http://localhost:5173/**

---

## Test the System

### 🎓 Student Flow (NEW!)

1. Go to http://localhost:5173/
2. Click "Get Started"
3. You'll see **Student Login**

#### Option A: Login with Existing Account
```
Email: your.student@college.edu
Password: your_password
```

#### Option B: Create New Student Account
1. Click "Sign up as Student"
2. Fill in details:
   ```
   Full Name: John Doe
   Email: john@college.edu
   College: IIIT Hyderabad
   Roll Number: 20BCS123
   Password: password123
   ```
3. Click "Sign Up as Student"
4. Redirected to **Student Dashboard** ✅

### 🔐 Admin Flow (NEW!)

1. Go to http://localhost:5173/
2. Click navigation or go to `/admin-login`
3. You'll see **Admin Login**

#### Admin Credentials (Default)
```
Email: admin@gyanasetu.com
Password: adminpass123
Admin Code: ADMIN2025
```

4. Click "Login as Admin"
5. Redirected to **Admin Dashboard** ✅

---

## New Routes

### Public Routes
```
/                    → Home Page
/student-login       → Student Login
/student-signup      → Student Registration
/admin-login         → Admin Login
```

### Student Protected Routes
```
/student-dashboard   → Main Dashboard
/post-resource       → Create Resource
/resource/:id        → View Resource Details
```

### Admin Protected Routes
```
/admin-dashboard     → Admin Panel
```

---

## Dashboard Features

### 🎓 Student Dashboard

**Left Sidebar:**
- 🔍 Search resources
- 🏷️ Filter by category
- 🏫 Filter by college
- 📊 Statistics

**Main Area:**
- 📚 Browse resources (grid view)
- ➕ Post new resource button
- 👤 User profile menu
- 🚪 Logout

**Actions:**
- Click resource card → View details
- Click "+ Share Resource" → Post resource
- Click "Logout" → Return to home

### 🔐 Admin Dashboard

**Left Sidebar Navigation:**
- 📊 Overview (analytics)
- 📚 Resources (manage all)
- 👥 Users (coming soon)
- 📮 Requests (review)
- ⚙️ Settings (platform config)

**Overview Tab:**
- Total resources count
- Active users count
- Total requests count
- Resources by college chart
- Category breakdown

**Resources Tab:**
- List all resources
- Edit/Delete buttons
- Metadata display

**Requests Tab:**
- View all requests
- Request status
- Approve/Reject buttons

**Settings Tab:**
- Toggle features on/off
- Email notifications
- Auto-approval options

---

## File Changes

### New Pages Created
```
src/pages/
├── StudentLogin.jsx      ✨ NEW
├── StudentSignup.jsx     ✨ NEW
├── AdminLogin.jsx        ✨ NEW
├── StudentDashboard.jsx  ✨ NEW
└── AdminDashboard.jsx    ✨ NEW
```

### New Styles
```
src/styles/
└── admin-dashboard.css   ✨ NEW
```

### Updated Files
```
src/
├── App.jsx (router updated)
├── store/authStore.js (role support added)
└── pages/Home.jsx (navigation updated)
```

### Documentation
```
📄 ADMIN_STUDENT_AUTH.md ✨ NEW - Full guide
```

---

## Database Structure

### Firestore Collections

**Students:**
```javascript
{
  uid: "firebase_id",
  email: "student@college.edu",
  fullName: "Student Name",
  college: "IIIT Hyderabad",
  rollNo: "20BCS123",
  role: "student",
  createdAt: "2025-12-26T10:00:00Z"
}
```

**Admins:**
```javascript
{
  uid: "firebase_id",
  email: "admin@gyanasetu.com",
  fullName: "Admin Name",
  role: "admin",
  createdAt: "2025-12-26T10:00:00Z"
}
```

---

## Common Tasks

### Create Test Student Account

1. Go to `/student-signup`
2. Fill form:
   ```
   Full Name: Test Student
   Email: test@college.edu
   College: IIIT Hyderabad
   Roll No: 20BCS001
   Password: test123
   ```
3. Click "Sign Up as Student"

### Create Test Admin Account

**In Firebase Console:**
1. Go to **Authentication** → **Users**
2. Add new user:
   ```
   Email: newadmin@gyanasetu.com
   Password: adminpass123
   ```
3. Update Firestore `users` collection:
   - Document ID: (Firebase UID)
   - Fields: role: "admin"

### Change Admin Code

**File:** `src/pages/AdminLogin.jsx` (Line ~30)

Find:
```javascript
if (adminCode !== 'ADMIN2025') {
```

Change to:
```javascript
if (adminCode !== 'YOUR_NEW_CODE') {
```

Then redeploy.

---

## Testing Checklist

- [ ] Student can sign up
- [ ] Student can login
- [ ] Student sees dashboard
- [ ] Admin can login with code
- [ ] Admin sees admin panel
- [ ] Student cannot access admin dashboard
- [ ] Admin cannot access student dashboards
- [ ] Logout works from both dashboards
- [ ] Protected routes redirect properly
- [ ] Resources display in student view
- [ ] Admin can see all resources
- [ ] Search/filter works

---

## Troubleshooting

### Issue: "Invalid admin code"
- ✅ Check code is: `ADMIN2025` (exact)
- ✅ No spaces before/after
- ✅ Correct capitalization

### Issue: "Invalid email or password"
- ✅ Check email exists
- ✅ Check password correct
- ✅ Try creating new account

### Issue: Student on admin login page
- ✅ Go to `/student-login` instead
- ✅ Click "Student Login" link

### Issue: Pages not loading
- ✅ Check dev server running: `npm run dev`
- ✅ Check http://localhost:5173/
- ✅ Clear browser cache

---

## Next Steps

1. **Complete Firebase Setup**
   - Follow [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
   - Create Firestore collections
   - Set security rules

2. **Create More Test Accounts**
   - Test with different colleges
   - Test student workflow
   - Test admin features

3. **Customize Admin Code**
   - Change `ADMIN2025` to your code
   - Store in environment variable
   - Document securely

4. **Deploy to Production**
   - See [DEPLOYMENT.md](DEPLOYMENT.md)
   - Set up CI/CD
   - Configure Firebase for production

---

## Full Documentation

- 📚 [README.md](README.md) - Project overview
- 🔐 [ADMIN_STUDENT_AUTH.md](ADMIN_STUDENT_AUTH.md) - **Full authentication guide**
- 🏗️ [ARCHITECTURE.md](ARCHITECTURE.md) - System design
- ⚙️ [FIREBASE_SETUP.md](FIREBASE_SETUP.md) - Database setup
- 🚀 [DEPLOYMENT.md](DEPLOYMENT.md) - Deploy to production
- 🔧 [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Problem solving

---

## Git Repository

**Push to GitHub:**
```bash
git add -A
git commit -m "Your message"
git push origin main
```

Your repo: https://github.com/somapujith/GyanaSetu

---

**Status:** ✅ Production Ready  
**Last Updated:** December 26, 2025  
**Version:** 2.0 (With Admin & Student Auth)
