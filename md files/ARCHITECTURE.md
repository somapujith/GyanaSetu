# Gyana Setu - Architecture & System Design

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (React)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     React Router                          │  │
│  │  Routes: /, /login, /signup, /dashboard, /post, /:id   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌──────────────────────────┴──────────────────────────────┐  │
│  │                       Pages                              │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ • Home (Landing with animation)                          │  │
│  │ • Login (Auth form)                                      │  │
│  │ • SignUp (Registration form)                             │  │
│  │ • Dashboard (Resource listing & filtering)               │  │
│  │ • PostResource (Create new resource)                     │  │
│  │ • ResourceDetail (View & request resource)               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌──────────────────────────┴──────────────────────────────┐  │
│  │                    Components                            │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ • Silk (Animated background)                             │  │
│  │ • ResourceCard (Resource display)                        │  │
│  │ • Protected Routes (Auth wrapper)                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌──────────────────────────┴──────────────────────────────┐  │
│  │              State Management (Zustand)                  │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ authStore.js                                             │  │
│  │ ├── user (auth state)                                    │  │
│  │ ├── userProfile (user data)                              │  │
│  │ ├── register() → Firebase                                │  │
│  │ ├── login() → Firebase                                   │  │
│  │ ├── logout() → Firebase                                  │  │
│  │ └── initAuth() → Listen to auth changes                  │  │
│  │                                                           │  │
│  │ resourceStore.js                                         │  │
│  │ ├── resources[] (list of resources)                      │  │
│  │ ├── createResource()                                     │  │
│  │ ├── fetchResources()                                     │  │
│  │ ├── searchResources()                                    │  │
│  │ ├── updateResource()                                     │  │
│  │ ├── deleteResource()                                     │  │
│  │ └── requestResource()                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                               │ HTTP Requests
                               │ (Firebase SDK)
                               │
┌──────────────────────────────┼───────────────────────────────────┐
│                   FIREBASE BACKEND                               │
├──────────────────────────────┼───────────────────────────────────┤
│                              ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Firebase Authentication                          │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ • Email/Password auth                                    │  │
│  │ • Session management                                     │  │
│  │ • Token generation                                       │  │
│  │ • User UID management                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│           │                    │                   │             │
│           ▼                    ▼                   ▼             │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐│
│  │ Firestore DB     │ │ Cloud Storage    │ │ Realtime Sync    ││
│  ├──────────────────┤ ├──────────────────┤ ├──────────────────┤│
│  │ Collections:     │ │ Image storage    │ │ Listeners active ││
│  │ • users          │ │ Bucket config    │ │ Auto updates     ││
│  │ • resources      │ │ Access control   │ │ Query results    ││
│  │ • requests       │ │ CDN delivery     │ │ Auth state       ││
│  │ • reviews (TBD)  │ │                  │ │                  ││
│  │ • messages (TBD) │ │                  │ │                  ││
│  └──────────────────┘ └──────────────────┘ └──────────────────┘│
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### User Registration Flow
```
User Input (SignUp Form)
    │
    ▼
Form Validation
    │
    ├─ Valid ──▶ authStore.register()
    │              │
    │              ▼
    │          Firebase createUserWithEmailAndPassword()
    │              │
    │              ├─ Success ──▶ Create user doc in Firestore
    │              │               │
    │              │               ▼
    │              │           Set auth state in Zustand
    │              │               │
    │              │               ▼
    │              │           Redirect to /dashboard
    │              │
    │              └─ Error ──▶ Display error message
    │
    └─ Invalid ──▶ Show validation errors
```

### Resource Posting Flow
```
User clicks "Post Resource"
    │
    ▼
Fill form (title, description, etc)
    │
    ▼
Form Validation
    │
    ├─ Valid ──▶ resourceStore.createResource()
    │              │
    │              ▼
    │          Add document to /resources collection
    │              │
    │              ├─ Success ──▶ Redirect to /dashboard
    │              │               │
    │              │               ▼
    │              │           Fetch updated resources
    │              │               │
    │              │               ▼
    │              │           Display on dashboard
    │              │
    │              └─ Error ──▶ Show error message
    │
    └─ Invalid ──▶ Show field errors
```

### Resource Request Flow
```
User views resource detail
    │
    ▼
Click "Request Resource" button
    │
    ▼
Open request form
    │
    ▼
Write message
    │
    ▼
Submit request
    │
    ▼
resourceStore.requestResource()
    │
    ▼
Update resource document:
    ▼
Add to requests[] array
    │
    ├─ Success ──▶ Show success message
    │               │
    │               ▼
    │           Resource owner sees request in detail page
    │
    └─ Error ──▶ Show error message
```

## Database Schema

### Users Collection
```javascript
{
  uid: string (primary key - Firebase UID),
  email: string,
  fullName: string,
  college: string,
  createdAt: timestamp,
  avatar: string (URL, optional),
  bio: string (optional),
  reputation: number (TBD),
  totalResourcesShared: number (TBD),
  totalRequests: number (TBD)
}
```

### Resources Collection
```javascript
{
  id: string (primary key - auto-generated),
  userId: string (foreign key → users.uid),
  userName: string (denormalized),
  userEmail: string (denormalized),
  college: string,
  
  // Basic Info
  title: string,
  description: string,
  category: string (enum: books|lab|tools|projects|other),
  condition: string (enum: excellent|good|fair),
  
  // Location & Availability
  location: string,
  availableFrom: date,
  availableTo: date (optional),
  
  // Media
  image: string (URL, optional),
  
  // Status
  status: string (enum: available|borrowed|removed),
  
  // Requests
  requests: array[{
    userId: string,
    userEmail: string (optional),
    message: string,
    createdAt: timestamp,
    status: string (enum: pending|accepted|rejected|completed)
  }],
  
  // Metadata
  views: number (TBD),
  rating: number (TBD),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Component Tree

```
App
├── Router
│   ├── Route: /
│   │   └── Home
│   │       ├── Silk (animated background)
│   │       └── useLoaderAnimation hook
│   │
│   ├── Route: /login
│   │   └── Login
│   │       └── useAuthStore
│   │
│   ├── Route: /signup
│   │   └── SignUp
│   │       └── useAuthStore
│   │
│   ├── Route: /dashboard (Protected)
│   │   └── Dashboard
│   │       ├── useAuthStore
│   │       ├── useResourceStore
│   │       ├── Filter sidebar
│   │       └── ResourceCard × many
│   │
│   ├── Route: /post-resource (Protected)
│   │   └── PostResource
│   │       ├── useAuthStore
│   │       └── useResourceStore
│   │
│   └── Route: /resource/:id (Protected)
│       └── ResourceDetail
│           ├── useAuthStore
│           ├── useResourceStore
│           └── Request form
│
├── Store: authStore (Zustand)
└── Store: resourceStore (Zustand)
```

## State Management Flow

### Auth Store
```
Initial State:
{
  user: null,
  userProfile: null,
  loading: true,
  error: null
}

Actions:
├── initAuth()
│   └── Listen to Firebase auth state changes
│       └── Fetch user profile from Firestore
│
├── register(email, password, college, fullName)
│   ├── Create user in Firebase Auth
│   ├── Create profile in Firestore
│   └── Update state with new user
│
├── login(email, password)
│   ├── Authenticate with Firebase
│   ├── Fetch user profile
│   └── Update state
│
└── logout()
    ├── Sign out from Firebase
    └── Clear state
```

### Resource Store
```
Initial State:
{
  resources: [],
  loading: false,
  error: null
}

Actions:
├── createResource(data)
│   ├── Add document to Firestore
│   └── Return resource ID
│
├── fetchResources(filters)
│   ├── Query Firestore with filters
│   └── Update resources state
│
├── searchResources(term)
│   ├── Search by title/description
│   └── Return filtered results
│
├── updateResource(id, updates)
│   ├── Update document in Firestore
│   └── Refresh state
│
├── deleteResource(id)
│   ├── Delete document from Firestore
│   └── Update state
│
└── requestResource(resourceId, userId, message)
    ├── Add request to requests[] array
    └── Update resource in Firestore
```

## Authentication Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ 1. User enters credentials
       ▼
   ┌────────────────────┐
   │  React Component   │
   │  (Login/SignUp)    │
   └────────┬───────────┘
       │
       │ 2. Form validation
       │ 3. Call authStore.register/login()
       │
       ▼
   ┌────────────────────────┐
   │  Zustand Auth Store    │
   │ (authStore.js)         │
   └────────┬───────────────┘
       │
       │ 4. Call Firebase API
       │
       ▼
   ┌────────────────────────┐
   │  Firebase SDK          │
   │  • Authentication      │
   │  • Firestore           │
   └────────┬───────────────┘
       │
       │ 5. Send to Firebase servers
       │
       ▼
   ┌────────────────────────┐
   │  Firebase Backend      │
   │  • Validate credentials│
   │  • Create user         │
   │  • Issue JWT token     │
   └────────┬───────────────┘
       │
       │ 6. Return user & token
       │
       ▼
   ┌────────────────────────┐
   │  Firebase SDK          │
   │  (client)              │
   └────────┬───────────────┘
       │
       │ 7. Store user in SDK
       │ 8. Emit auth state change
       │
       ▼
   ┌────────────────────────┐
   │  Zustand Auth Store    │
   │ (onAuthStateChanged)   │
   └────────┬───────────────┘
       │
       │ 9. Update state with user
       │
       ▼
   ┌────────────────────────┐
   │  React Components      │
   │  (Re-render)           │
   └────────┬───────────────┘
       │
       │ 10. Update UI
       │
       ▼
   ┌────────────────────────┐
   │  Redirect to dashboard │
   │  or show content       │
   └────────────────────────┘
```

## Security Architecture

```
┌──────────────────────────────────────┐
│         CLIENT LAYER                  │
├──────────────────────────────────────┤
│ 1. Input Validation                   │
│    └── Validate all form inputs       │
│ 2. Error Handling                     │
│    └── Don't expose sensitive data    │
│ 3. HTTPS Only                         │
│    └── All requests encrypted         │
└────────────────┬─────────────────────┘
                 │
                 │ HTTPS
                 │ (Encrypted)
                 ▼
┌──────────────────────────────────────┐
│       FIREBASE SECURITY                │
├──────────────────────────────────────┤
│ 1. Authentication                     │
│    └── Email/password validation      │
│ 2. Authorization (Firestore Rules)    │
│    └── Check user.uid on operations   │
│ 3. Data Encryption                    │
│    └── In transit & at rest           │
│ 4. Access Control                     │
│    └── Users can only access own docs │
└──────────────────────────────────────┘
```

## Deployment Architecture

```
┌──────────────────────────┐
│    Local Development     │
│  npm run dev (Vite)      │
│  localhost:5173          │
└───────────┬──────────────┘
            │
            ├─────────────────────────┐
            │                         │
            ▼                         ▼
    ┌──────────────────┐    ┌──────────────────┐
    │  Build Process   │    │  Source Code     │
    │  npm run build   │    │  (git)           │
    └────────┬─────────┘    └──────────────────┘
            │
            ▼
    ┌──────────────────┐
    │  Dist Folder     │
    │  (Optimized)     │
    └────────┬─────────┘
            │
            │ Deploy to:
            │
            ├─ Vercel
            ├─ Netlify
            ├─ Firebase Hosting
            └─ Any static host
```

## Performance Optimization

```
┌────────────────────────────────────────┐
│      Performance Strategies             │
├────────────────────────────────────────┤
│ 1. Code Splitting (React Router)       │
│    └── Lazy load pages                 │
│ 2. Component Memoization               │
│    └── Prevent unnecessary re-renders  │
│ 3. Zustand Store                       │
│    └── Selective state subscriptions   │
│ 4. Firebase Indexing                   │
│    └── Query optimization              │
│ 5. CDN for Images                      │
│    └── Cloud Storage delivery          │
│ 6. Caching                             │
│    └── Browser cache + Firestore cache │
└────────────────────────────────────────┘
```

---

This architecture provides:
- ✅ Scalability
- ✅ Security
- ✅ Maintainability
- ✅ Performance
- ✅ Real-time updates
- ✅ Easy to extend
