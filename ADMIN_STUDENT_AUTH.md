# 🔐 Admin & Student Authentication Guide

This document explains the dual-role authentication system for GyanaSetu, with separate logins and dashboards for administrators and students.

---

## System Overview

The authentication system now supports **two distinct user roles**:

1. **Students** - Can browse resources, post items, and make requests
2. **Admins** - Can manage platform, moderate content, and view analytics

Each role has:
- ✅ Separate login page
- ✅ Custom signup/registration  
- ✅ Dedicated dashboard
- ✅ Role-specific features
- ✅ Protected routes

---

## User Flows

### Student Flow

```
🏠 Home Page
    ↓
📝 Student Login (/student-login)
    ↓
✅ Authenticate
    ↓
🎓 Student Dashboard (/student-dashboard)
    ├── Browse Resources
    ├── Post Resource (/post-resource)
    ├── View Details (/resource/:id)
    └── Make Requests
```

### Admin Flow

```
🏠 Home Page
    ↓
🔐 Admin Login (/admin-login)
    ↓
✅ Authenticate + Admin Code
    ↓
⚙️ Admin Dashboard (/admin-dashboard)
    ├── View Statistics
    ├── Manage Resources
    ├── View Users
    ├── Process Requests
    └── Platform Settings
```

---

## Routes & Navigation

### Public Routes (No Authentication Required)

```javascript
GET  /                      // Home page
GET  /student-login         // Student login
GET  /student-signup        // Student registration
GET  /admin-login           // Admin login
```

### Protected Routes - Student Only

```javascript
GET  /student-dashboard     // Main student dashboard
POST /post-resource         // Create resource
GET  /resource/:id          // View resource details
```

### Protected Routes - Admin Only

```javascript
GET  /admin-dashboard       // Admin management panel
```

### Legacy Routes (Backward Compatibility)

```javascript
GET  /login                 // Redirects to /student-login
GET  /signup                // Redirects to /student-signup
GET  /dashboard             // Redirects to /student-dashboard
```

---

## Login Pages

### Student Login (`/student-login`)

**File:** `src/pages/StudentLogin.jsx`

**Features:**
- Simple email/password authentication
- "Show/hide password" toggle
- Error message display
- Link to student signup
- Link to admin login

**Form Fields:**
```
- College Email (required)
- Password (required)
```

**Example Credentials:**
```
Email: student@college.edu
Password: password123
```

**Redirects To:**
- ✅ Success → `/student-dashboard`
- ❌ Invalid → Error message shown

### Admin Login (`/admin-login`)

**File:** `src/pages/AdminLogin.jsx`

**Features:**
- Email + Password + Admin Code verification
- Three-field authentication
- Prevents unauthorized access
- Password toggle
- Link to student login

**Form Fields:**
```
- Admin Email (required)
- Password (required)
- Admin Code (required)
```

**Default Admin Code:** `ADMIN2025`

⚠️ **IMPORTANT:** Change this in production!

**Example Credentials:**
```
Email: admin@gyanasetu.com
Password: adminpass123
Code: ADMIN2025
```

**Redirects To:**
- ✅ Success → `/admin-dashboard`
- ❌ Invalid → Error message shown

---

## Signup/Registration

### Student Signup (`/student-signup`)

**File:** `src/pages/StudentSignup.jsx`

**Form Fields:**
```
1. Full Name           (required)
2. College Email       (required, must be valid email)
3. College            (required, dropdown selection)
4. Roll Number        (required)
5. Password           (required, min 6 characters)
6. Confirm Password   (required, must match)
```

**Available Colleges:**
- IIIT Hyderabad
- Osmania University
- JNTU Hyderabad
- BITS Pilani Hyderabad
- VNR Vignana Jyothi Institute

**Validation:**
- ✅ Email format validation
- ✅ Password strength (minimum 6 chars)
- ✅ Password confirmation match
- ✅ All fields required
- ✅ Real-time error messages

**Redirects To:**
- ✅ Success → `/student-dashboard`
- ❌ Invalid → Errors shown on form

**Data Stored in Firestore:**
```javascript
{
  uid: "user_id",
  email: "student@college.edu",
  fullName: "Student Name",
  college: "IIIT Hyderabad",
  rollNo: "20BCS123",
  role: "student",
  createdAt: "2025-12-26T10:00:00Z",
  avatar: null,
  bio: ""
}
```

---

## Dashboards

### Student Dashboard (`/student-dashboard`)

**File:** `src/pages/StudentDashboard.jsx`

**Layout:**
```
┌─────────────────────────────────┐
│ Header: Welcome Message + CTA    │
├────────────────────────────────┤
│ Sidebar          │   Main Content│
│ Filters          │   Resources   │
│ - Search         │   Grid View   │
│ - Category       │   (Cards)     │
│ - College        │               │
│ - Reset          │               │
│ Stats            │               │
└─────────────────────────────────┘
```

**Key Features:**
- 🔍 Search resources by title/description
- 🏷️ Filter by category (books, lab, tools, projects, other)
- 🏫 Filter by college
- ➕ Share resource button
- 📊 Statistics sidebar
- 🗂️ Grid view of resources
- 👤 User menu with logout

**Sidebar Stats:**
- Total resources available
- Total requests made

**Resource Cards Display:**
- Image/Placeholder
- Title & Description
- Category badge
- Condition indicator
- Owner information
- College & Location
- "View Details" button

**Actions:**
- Post new resource → `/post-resource`
- View resource details → `/resource/:id`
- Logout → `/`

### Admin Dashboard (`/admin-dashboard`)

**File:** `src/pages/AdminDashboard.jsx`

**Layout:**
```
┌─────────────────────────────────┐
│ Header: Admin Title + Profile    │
├────────────────────────────────┤
│ Sidebar Nav      │   Tab Content│
│ - Overview (📊)  │ (Dynamic)    │
│ - Resources (📚) │              │
│ - Users (👥)     │              │
│ - Requests (📮)  │              │
│ - Settings (⚙️)  │              │
└─────────────────────────────────┘
```

**Overview Tab (📊)**
- **Statistics Cards:**
  - Total Resources
  - Active Users
  - Total Requests
  - Active Today

- **College Distribution Chart:**
  - Shows resources per college
  - Progress bars with counts
  - Visual comparison

- **Category Breakdown:**
  - Resource count by category
  - Pills with counts

**Resources Tab (📚)**
- Full list of all platform resources
- View title, category, location
- Edit/Delete buttons per resource
- Resource metadata (date, college)
- Empty state message

**Users Tab (👥)**
- User management interface
- Placeholder for phase 2 (coming soon)

**Requests Tab (📮)**
- View all resource requests
- Show request status
- See requester message
- Approve/Reject buttons
- Filter by status

**Settings Tab (⚙️)**
- Platform configuration
- Checkboxes for features:
  - Allow new student registrations
  - Enable resource posting
  - Auto-approve resource posts
  - Email on new requests
- Save Settings button

---

## Authentication Flow

### Database Structure

**Firestore Collection: `users`**

```javascript
// Student User Document
{
  uid: "unique_firebase_id",
  email: "student@college.edu",
  fullName: "John Doe",
  college: "IIIT Hyderabad",
  rollNo: "20BCS123",
  role: "student",
  createdAt: "2025-12-26T10:00:00Z",
  avatar: null,
  bio: ""
}

// Admin User Document
{
  uid: "unique_firebase_id",
  email: "admin@gyanasetu.com",
  fullName: "Admin Name",
  college: "Administration",
  role: "admin",
  createdAt: "2025-12-26T10:00:00Z"
}
```

### Auth Store (Zustand)

**File:** `src/store/authStore.js`

**State:**
```javascript
{
  user: Firebase User Object,
  userProfile: {
    uid, email, fullName, college, role, ...
  },
  loading: boolean,
  error: string | null
}
```

**Methods:**

#### `initAuth()`
- Called on app initialization
- Listens to Firebase auth state changes
- Fetches user profile from Firestore
- Sets loading state

```javascript
useAuthStore.getState().initAuth();
```

#### `register(email, password, college, fullName, role, rollNo)`
- Creates new user in Firebase Auth
- Creates user profile in Firestore
- Supports both student and admin roles
- Validates email uniqueness

```javascript
await register(
  'student@college.edu',
  'password123',
  'IIIT Hyderabad',
  'John Doe',
  'student',
  '20BCS123'
);
```

#### `login(email, password, role)`
- Authenticates user with Firebase
- Fetches user profile
- Verifies role matches (security check)
- Returns user object

```javascript
await login('student@college.edu', 'password123', 'student');
```

#### `logout()`
- Signs out from Firebase
- Clears auth state
- Clears user profile

```javascript
await logout();
```

#### `clearError()`
- Clears error message from state

```javascript
clearError();
```

---

## Protected Routes

### Route Protection Component

**File:** `src/App.jsx`

```javascript
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, userProfile, loading } = useAuthStore();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" />;
  if (requiredRole && userProfile?.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};
```

### Route Configuration

**Student Route:**
```jsx
<Route
  path="/student-dashboard"
  element={
    <ProtectedRoute requiredRole="student">
      <StudentDashboard />
    </ProtectedRoute>
  }
/>
```

**Admin Route:**
```jsx
<Route
  path="/admin-dashboard"
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

**Any Authenticated User:**
```jsx
<Route
  path="/resource/:id"
  element={
    <ProtectedRoute>
      <ResourceDetail />
    </ProtectedRoute>
  }
/>
```

---

## Security Considerations

### ✅ Implemented

1. **Firebase Authentication**
   - Secure password hashing
   - Email verification capable
   - Session persistence

2. **Role-Based Access Control**
   - Front-end route protection
   - Database role verification on login
   - Separate admin code validation

3. **Input Validation**
   - Client-side form validation
   - Firebase rules enforcement
   - Error message sanitization

4. **Data Privacy**
   - User data in Firestore
   - Firebase security rules
   - No sensitive data in URLs

### 🔒 Production Recommendations

1. **Admin Code**
   ```javascript
   // Change the default code:
   // File: src/pages/AdminLogin.jsx, Line: if (adminCode !== 'ADMIN2025')
   // Use environment variable instead:
   if (adminCode !== process.env.VITE_ADMIN_CODE)
   ```

2. **Email Verification**
   - Enable in Firebase Console
   - Require email verification on signup
   - Add verification check before dashboard access

3. **Two-Factor Authentication**
   - Add optional 2FA for admins
   - Use Firebase Phone Auth or TOTP

4. **Firestore Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read: if request.auth.uid == userId || 
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
         allow create: if request.auth.uid == userId;
         allow write: if request.auth.uid == userId;
       }
     }
   }
   ```

5. **Admin Code Distribution**
   - Send via secure email
   - Use time-limited tokens
   - Regenerate codes regularly
   - Log admin access

---

## Testing Login System

### Test Accounts

**Student Account:**
```
Email: test.student@college.edu
Password: testpass123
Roll No: 20BCS001
College: IIIT Hyderabad
```

**Admin Account:**
```
Email: admin@gyanasetu.com
Password: adminpass123
Admin Code: ADMIN2025
```

### Test Scenarios

1. **Student Login**
   - ✅ Valid credentials → Dashboard
   - ❌ Invalid email → Error message
   - ❌ Wrong password → Error message
   - ❌ Using admin code → Error

2. **Admin Login**
   - ✅ Valid all three fields → Admin Dashboard
   - ❌ Wrong email → Error message
   - ❌ Wrong password → Error message
   - ❌ Wrong admin code → Error
   - ❌ Valid email/password but wrong role → Error

3. **Student Signup**
   - ✅ Valid all fields → Dashboard redirect
   - ❌ Password too short → Error
   - ❌ Passwords don't match → Error
   - ❌ Email already exists → Error
   - ❌ Missing college → Error

4. **Route Protection**
   - Try accessing `/student-dashboard` without login → Redirects to `/`
   - Try accessing `/admin-dashboard` as student → Redirects to `/`
   - Try accessing `/student-dashboard` as admin → Redirects to `/`

---

## File Structure

```
src/
├── pages/
│   ├── StudentLogin.jsx
│   ├── StudentSignup.jsx
│   ├── AdminLogin.jsx
│   ├── StudentDashboard.jsx
│   ├── AdminDashboard.jsx
│   ├── PostResource.jsx
│   └── ResourceDetail.jsx
├── store/
│   ├── authStore.js (updated)
│   └── resourceStore.js
├── styles/
│   ├── auth.css (updated)
│   ├── admin-dashboard.css (new)
│   ├── dashboard.css
│   └── ...other styles
├── components/
│   └── ResourceCard.jsx
└── App.jsx (updated)
```

---

## API Integration Points

### Firebase Auth Methods Used

```javascript
import {
  createUserWithEmailAndPassword,  // Student signup
  signInWithEmailAndPassword,      // Both login
  signOut,                         // Logout
  onAuthStateChanged               // Auth state listener
} from 'firebase/auth';
```

### Firestore Methods Used

```javascript
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Create user profile
await setDoc(doc(db, 'users', user.uid), userProfile);

// Fetch user profile
const docSnap = await getDoc(doc(db, 'users', user.uid));
```

---

## Future Enhancements

### Phase 2 Features

- [ ] Email verification on signup
- [ ] Password reset flow
- [ ] Two-factor authentication
- [ ] User profile editing
- [ ] Avatar uploads
- [ ] Email notifications

### Phase 3 Features

- [ ] Social login (Google, GitHub)
- [ ] Role-based permissions matrix
- [ ] Admin activity logging
- [ ] Advanced user analytics
- [ ] Invite-only admin registration
- [ ] Session management/timeout

---

## Troubleshooting

### Issue: "Invalid email or password"
- Check email is spelled correctly
- Verify password matches signup password
- Ensure account exists (try signup)
- Check caps lock on password

### Issue: "Invalid admin code"
- Verify code is exactly: `ADMIN2025` (case-sensitive)
- Check for extra spaces
- Confirm you have admin privileges

### Issue: Logged in but dashboard shows "Not authenticated"
- Clear browser cache
- Check Firebase connection
- Verify `.env` file with credentials
- Check browser console for errors

### Issue: Can't create account
- Email might be already registered
- Password too short (need 6+ chars)
- Passwords don't match
- Check internet connection

---

## Support

For issues or questions:
1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Review Firebase Console logs
3. Check browser console errors
4. See [README.md](README.md) for setup

---

**Version:** 1.0  
**Last Updated:** December 26, 2025  
**Status:** ✅ Production Ready (with security updates)
