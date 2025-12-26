# 🏗️ Authentication System Architecture

Visual diagrams and flows for the admin & student authentication system.

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    GyanaSetu Platform                        │
│                   (React + Firebase)                         │
└─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
    ┌───────▼────────┐  ┌──▼────────┐  ┌──▼────────┐
    │   Home Page    │  │ Auth Pages │  │  Admin    │
    │   (Public)     │  │ (Public)   │  │ Dashboard │
    └────────────────┘  └────────────┘  │ (Private) │
                             │           └──────────┘
            ┌────────────────┼────────────────┐
            │                │                │
       ┌────▼─────┐    ┌─────▼────┐   ┌──────▼──┐
       │ Student  │    │  Student │   │  Admin  │
       │  Login   │    │  SignUp  │   │  Login  │
       └────┬─────┘    └─────┬────┘   └──┬─────┘
            │                │           │
            │ [Email/Pwd]     │           │ [Email/Pwd/Code]
            │                │           │
            └────────────────┼───────────┘
                             │
                      ┌──────▼──────┐
                      │   Firebase  │
                      │     Auth    │
                      └──────┬──────┘
                             │
                      ┌──────▼──────────┐
                      │ Authenticate    │
                      │ & Fetch Profile │
                      └──────┬──────────┘
                             │
                      ┌──────▼──────────┐
                      │  Zustand Store  │
                      │  (authStore)    │
                      └──────┬──────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
       ┌────▼──────┐    ┌────▼────┐   ┌──────▼──┐
       │  Student  │    │ Resource │   │  Admin  │
       │ Dashboard │    │ Dashboard│   │Dashboard│
       └───────────┘    └──────────┘   └─────────┘
```

---

## User Authentication Flow

### Student Registration Flow

```
┌─────────────────────────────────────────────┐
│        Student Signup Form                  │
├─────────────────────────────────────────────┤
│                                             │
│  Full Name:      [____________]            │
│  Email:          [____________]            │
│  College:        [▼ Select]                │
│  Roll Number:    [____________]            │
│  Password:       [____________]            │
│  Confirm:        [____________]            │
│                                             │
│  [Sign Up as Student]                      │
│                                             │
└────────────┬────────────────────────────────┘
             │
             ├─ Client-side Validation
             │  ├─ Email format
             │  ├─ Password length (6+)
             │  ├─ Password match
             │  └─ All fields required
             │
             ├─ Pass ✅
             │  │
             │  └─→ Firebase: createUserWithEmailAndPassword()
             │         │
             │         └─→ Create Auth User
             │
             ├─ Firestore: Create User Profile
             │  {
             │    uid: "firebase_id",
             │    email: "student@college.edu",
             │    fullName: "Student Name",
             │    college: "IIIT Hyderabad",
             │    rollNo: "20BCS123",
             │    role: "student",
             │    createdAt: timestamp
             │  }
             │
             └─→ Zustand: Update authStore
                └─→ Redirect to /student-dashboard ✅
```

### Student Login Flow

```
┌──────────────────────────────────┐
│   Student Login Form             │
├──────────────────────────────────┤
│                                  │
│  Email:    [student@college.edu] │
│  Password: [______________]      │
│  [👁️] Show Password              │
│                                  │
│  [Login as Student]              │
│                                  │
└────────────┬─────────────────────┘
             │
             ├─ Validate form
             │  └─ Email & Password required
             │
             ├─ Pass ✅
             │  │
             │  └─→ Firebase: signInWithEmailAndPassword()
             │         │
             │         ├─ Email found? ✅
             │         │  └─ Password correct? ✅
             │         │
             │         └─→ Firebase Auth User returned
             │
             ├─ Firestore: Fetch User Profile (users/:uid)
             │  └─→ Get user document with all fields
             │
             ├─ Verify Role
             │  └─ Is role === "student"? ✅
             │
             └─→ Zustand: Update authStore
                └─→ Redirect to /student-dashboard ✅

             ❌ Fail Cases:
             └─ Invalid email → "Invalid email or password"
             └─ Wrong password → "Invalid email or password"
             └─ Admin trying to login as student → Role mismatch error
```

### Admin Login Flow

```
┌────────────────────────────────────┐
│   Admin Login Form                 │
├────────────────────────────────────┤
│                                    │
│  Email:      [admin@gyanasetu.com] │
│  Password:   [______________]      │
│  Admin Code: [______________]      │
│  [👁️] Show Password                │
│                                    │
│  [Login as Admin]                  │
│                                    │
└────────────┬───────────────────────┘
             │
             ├─ Client-side Validation
             │  └─ Email, Password, Admin Code required
             │
             ├─ Verify Admin Code
             │  └─ Is adminCode === "ADMIN2025"? ✅
             │
             ├─ Pass ✅
             │  │
             │  └─→ Firebase: signInWithEmailAndPassword()
             │         │
             │         ├─ Email found? ✅
             │         │  └─ Password correct? ✅
             │         │
             │         └─→ Firebase Auth User returned
             │
             ├─ Firestore: Fetch User Profile
             │  └─→ Get user document
             │
             ├─ Verify Role
             │  └─ Is role === "admin"? ✅
             │
             └─→ Zustand: Update authStore
                └─→ Redirect to /admin-dashboard ✅

             ❌ Fail Cases:
             └─ Invalid admin code → "Invalid admin code"
             └─ Invalid email → "Invalid email or password"
             └─ Wrong password → "Invalid email or password"
             └─ Student trying to login as admin → Role mismatch error
```

---

## Route Protection Diagram

```
                    ┌─────────────┐
                    │   Browser   │
                    │  Navigation │
                    └──────┬──────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Check Auth  │
                    │   Status     │
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
     ❌ No User         ✅ User Found    Checking
        │                  │
        ▼                  ▼
   Redirect            Check Role
   to Home             Required?
                           │
                    ┌──────┴──────┐
                    │             │
                 No Role       Yes Role
                    │             │
                    ▼             ▼
               Render Page    Compare
                             (user.role === 
                              requiredRole?)
                                  │
                            ┌─────┴──────┐
                            │            │
                         Match       No Match
                            │            │
                            ▼            ▼
                       Render       Redirect
                       Page         to Home
                                   (403)
```

### Example Routes

```javascript
// Public Routes - Anyone can access
Route("/")              → Home (public)
Route("/student-login") → StudentLogin (public)
Route("/admin-login")   → AdminLogin (public)

// Student Protected Routes
Route("/student-dashboard")
  → ProtectedRoute(role="student")
  → StudentDashboard

Route("/post-resource")
  → ProtectedRoute(role="student")
  → PostResource

// Admin Protected Routes
Route("/admin-dashboard")
  → ProtectedRoute(role="admin")
  → AdminDashboard

// Any Authenticated User
Route("/resource/:id")
  → ProtectedRoute(role=null)
  → ResourceDetail
```

---

## Data Flow Diagram

```
┌────────────────┐
│  React Pages   │
│ (Components)   │
└────────┬───────┘
         │
         ├─ StudentLogin.jsx
         ├─ StudentSignup.jsx
         ├─ AdminLogin.jsx
         ├─ StudentDashboard.jsx
         └─ AdminDashboard.jsx
         │
         ▼
┌────────────────────────┐
│  Zustand Store         │
│  (authStore.js)        │
└────────┬───────────────┘
         │
    ┌────┴────┐
    │          │
    ▼          ▼
Firebase   User State
Auth       & Profile
    │          │
    └─────┬────┘
          │
          ▼
     Firestore
     (users collection)
          │
    ┌─────┴─────┐
    │           │
Student        Admin
Profile        Profile
    │           │
    └─────┬─────┘
          │
          ▼
    Protected Routes
    & Dashboards
```

---

## Firestore Data Structure

```
Database: Firestore
├── Collection: users
│   ├── Document: {firebase_uid}
│   │   ├── uid: string
│   │   ├── email: string
│   │   ├── fullName: string
│   │   ├── college: string
│   │   ├── role: "student" | "admin"
│   │   ├── rollNo: string (students only)
│   │   ├── avatar: string (nullable)
│   │   ├── bio: string
│   │   └── createdAt: timestamp
│   │
│   └── Document: {firebase_uid}
│       ├── uid: string
│       ├── email: string
│       ├── fullName: string
│       ├── role: "admin"
│       ├── createdAt: timestamp
│       └── ...
│
└── Collection: resources
    ├── Document: {resource_id}
    │   ├── userId: string
    │   ├── title: string
    │   ├── description: string
    │   ├── category: string
    │   ├── college: string
    │   ├── location: string
    │   ├── image: string (URL)
    │   ├── condition: string
    │   ├── createdAt: timestamp
    │   └── requests: [
    │       {
    │           userId: string,
    │           message: string,
    │           status: "pending",
    │           createdAt: timestamp
    │       }
    │   ]
    └── ...
```

---

## Component Hierarchy

```
App.jsx (Router)
├── Home.jsx (public)
├── StudentLogin.jsx (public)
├── StudentSignup.jsx (public)
├── AdminLogin.jsx (public)
├── ProtectedRoute → StudentDashboard.jsx (role=student)
│   └── ResourceCard.jsx (multiple)
├── ProtectedRoute → PostResource.jsx (role=student)
├── ProtectedRoute → ResourceDetail.jsx (any auth)
└── ProtectedRoute → AdminDashboard.jsx (role=admin)
    ├── Overview Tab
    ├── Resources Tab
    ├── Users Tab
    ├── Requests Tab
    └── Settings Tab
```

---

## State Management Flow

```
┌─────────────────────────────────────┐
│    Zustand authStore                │
├─────────────────────────────────────┤
│                                     │
│  State:                             │
│  ├── user (Firebase User)           │
│  ├── userProfile (from Firestore)   │
│  ├── loading (boolean)              │
│  └── error (string | null)          │
│                                     │
│  Methods:                           │
│  ├── initAuth()                     │
│  ├── register(...)                  │
│  ├── login(email, pwd, role)        │
│  ├── logout()                       │
│  └── clearError()                   │
│                                     │
└─────────────────────────────────────┘
           │
           │ useAuthStore()
           │
    ┌──────┴──────────────┐
    │                     │
All Components         Protected
That Need Auth         Routes
    │                     │
    ├─ StudentLogin       ├─ StudentDashboard
    ├─ StudentSignup      ├─ AdminDashboard
    ├─ AdminLogin         ├─ PostResource
    └─ App.jsx            └─ ResourceDetail
```

---

## Request/Response Cycle

### Authentication Request

```
User Input
    ↓
Form Submission
    ↓
Client Validation ← Errors shown if invalid
    ↓
Firebase Call
    ├─ createUserWithEmailAndPassword()  [Signup]
    ├─ signInWithEmailAndPassword()      [Login]
    └─ signOut()                         [Logout]
    │
    ├─ Success → Firebase Returns User Object
    │   ↓
    │ Firestore Query
    │   ├─ GET users/{uid} [Fetch Profile]
    │   └─ Success → Firestore Returns Profile
    │
    └─ Error → Handle & Show Error Message
        ├─ auth/email-already-in-use
        ├─ auth/wrong-password
        ├─ auth/user-not-found
        └─ Custom: Role mismatch, Admin code invalid
        │
        └─ Error Displayed to User
            ↓
            Try Again
```

---

## Session Persistence Flow

```
┌─────────────────────────────────┐
│  App.jsx useEffect() on Mount   │
└────────────┬────────────────────┘
             │
             ▼
    authStore.initAuth()
             │
             ▼
Firebase: onAuthStateChanged()
    (Listener activated)
             │
    ┌────────┴────────┐
    │                 │
  User Logged        No User
  (Session Found)    (Session Expired)
    │                 │
    ▼                 ▼
Get Firebase     Clear authStore
User Object         │
    │               ▼
    ├─ Fetch User Profile from
    │  Firestore
    │
    └─→ Update authStore
        ├── user = Firebase User
        ├── userProfile = Firestore Data
        ├── loading = false
        └── Ready for App!
```

---

## Error Handling Flow

```
User Action
    │
    ├─ Client Validation
    │   ├─ Valid? → Continue
    │   └─ Invalid? → Show Error, Stop
    │
    ├─ Firebase Operation
    │   ├─ Success? → Continue
    │   └─ Error?
    │       │
    │       ├─ Email already in use
    │       │   └─ "Email already registered"
    │       │
    │       ├─ Wrong password
    │       │   └─ "Invalid email or password"
    │       │
    │       ├─ User not found
    │       │   └─ "Invalid email or password"
    │       │
    │       └─ Network error
    │           └─ "Connection error"
    │
    ├─ Role Verification
    │   ├─ Role matches? → Continue
    │   └─ Role mismatch?
    │       └─ "Invalid login. Expected admin,
    │           but account is student"
    │
    ├─ Admin Code Validation
    │   ├─ Code correct? → Continue
    │   └─ Code invalid?
    │       └─ "Invalid admin code"
    │
    └─ Store Error & Display to User
        ├─ Error shown in red box
        └─ User can try again
```

---

## File Dependencies

```
App.jsx
├── imports StudentLogin
├── imports StudentSignup
├── imports AdminLogin
├── imports StudentDashboard
├── imports AdminDashboard
├── imports authStore
└── imports Router

StudentLogin.jsx
├── imports useAuthStore
├── imports useNavigate
├── calls authStore.login()
└── uses auth.css

StudentSignup.jsx
├── imports useAuthStore
├── imports useNavigate
├── calls authStore.register()
└── uses auth.css

AdminLogin.jsx
├── imports useAuthStore
├── imports useNavigate
├── calls authStore.login()
└── uses auth.css

StudentDashboard.jsx
├── imports useAuthStore
├── imports useResourceStore
├── uses dashboard.css
└── renders ResourceCard

AdminDashboard.jsx
├── imports useAuthStore
├── imports useResourceStore
├── uses admin-dashboard.css
└── renders statistics/tables

authStore.js
├── imports Firebase Auth
├── imports Firestore
└── implements state & methods

Styles
├── auth.css (login/signup)
├── admin-dashboard.css
└── dashboard.css
```

---

## Configuration Diagram

```
┌──────────────────────────────────┐
│   .env File                      │
├──────────────────────────────────┤
│                                  │
│  VITE_FIREBASE_API_KEY=...       │
│  VITE_FIREBASE_AUTH_DOMAIN=...   │
│  VITE_FIREBASE_PROJECT_ID=...    │
│  VITE_FIREBASE_STORAGE_BUCKET=...│
│  VITE_FIREBASE_MESSAGING_ID=...  │
│  VITE_FIREBASE_APP_ID=...        │
│                                  │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  src/config/firebase.js          │
├──────────────────────────────────┤
│                                  │
│  Reads .env variables            │
│  Initializes Firebase SDK        │
│  Exports: auth, db, storage      │
│                                  │
└──────────┬───────────────────────┘
           │
           ├─→ authStore.js (uses auth)
           ├─→ StudentLogin.jsx (uses auth)
           ├─→ AdminLogin.jsx (uses auth)
           └─→ resourceStore.js (uses db)
```

---

## Deployment Architecture

```
Local Development
    │
    ├─ npm run dev
    └─→ http://localhost:5173
           │
           ├─→ React Dev Server
           ├─→ Hot Module Reload
           └─→ Firebase (cloud)

Production Deployment
    │
    ├─ npm run build
    └─→ dist/ (optimized bundle)
           │
           ├─→ Firebase Hosting (recommended)
           ├─→ Vercel
           ├─→ Netlify
           └─→ Custom Server
               │
               └─→ HTTPS
                  ├─→ Environment Variables
                  ├─→ Firebase Credentials
                  └─→ Ready for Users
```

---

## Timeline & Dependencies

```
Phase 1: Authentication ✅
├── StudentLogin ✅
├── StudentSignup ✅
├── AdminLogin ✅
├── authStore with Roles ✅
└── Route Protection ✅

Phase 2: Dashboards ✅
├── StudentDashboard ✅
├── AdminDashboard ✅
└── Protected Routes ✅

Phase 3: Future
├── Email Verification
├── Password Reset
├── 2FA for Admins
├── User Profile Editing
└── Advanced Analytics

All Phases: Documentation ✅
├── ADMIN_STUDENT_AUTH.md ✅
├── AUTH_QUICK_START.md ✅
└── This Architecture File ✅
```

---

**Version:** 1.0  
**Date:** December 26, 2025  
**Status:** ✅ Complete & Ready
