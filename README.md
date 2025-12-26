# Gyana Setu - Campus Resource Sharing Platform

A web application that enables students across Hyderabad colleges to share and borrow resources like books, notes, lab equipment, and study materials.

## Features

- **User Authentication**: Secure registration and login using Firebase
- **Resource Posting**: Share books, notes, lab equipment, and other study materials
- **Resource Discovery**: Browse and search for available resources by category and college
- **Request System**: Request resources from other students with messages
- **User Profiles**: View profiles of resource owners
- **College Network**: Connect with students from multiple Hyderabad colleges
- **Real-time Updates**: Instant notifications for resource requests

## Tech Stack

- **Frontend**: React with React Router
- **State Management**: Zustand
- **Backend**: Firebase (Authentication, Firestore, Cloud Storage)
- **Build Tool**: Vite
- **Styling**: CSS3
- **3D Graphics**: Three.js + React Three Fiber (for animated backgrounds)

## Supported Colleges

- IIIT Hyderabad
- Osmania University
- Jawaharlal Nehru Technological University (JNTU)
- Birla Institute of Technology & Science (BITS)
- VNR Vignana Jyothi Institute of Engineering and Technology

## Project Structure

```
src/
├── pages/              # Page components
│   ├── Home.jsx       # Landing page
│   ├── Login.jsx      # Login page
│   ├── SignUp.jsx     # Registration page
│   ├── Dashboard.jsx  # Main dashboard with resources
│   ├── PostResource.jsx # Create new resource
│   └── ResourceDetail.jsx # Resource details and requests
├── components/         # Reusable components
│   ├── Silk.jsx       # Animated background
│   └── ResourceCard.jsx # Resource display card
├── store/             # State management (Zustand)
│   ├── authStore.js   # Authentication state
│   └── resourceStore.js # Resource management
├── hooks/             # Custom hooks
│   └── useLoaderAnimation.js # GSAP animations
├── config/            # Configuration files
│   └── firebase.js     # Firebase setup
└── styles/            # CSS files
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd landingpage
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable the following services:
   - Authentication (Email/Password)
   - Firestore Database
   - Cloud Storage

3. Get your Firebase config credentials

4. Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

5. Add your Firebase credentials to `.env`:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Firestore Database Structure

Create the following collections in Firestore:

#### `users` Collection
```
{
  uid: string (auto)
  email: string
  fullName: string
  college: string
  createdAt: timestamp
  avatar: string (optional)
  bio: string
}
```

#### `resources` Collection
```
{
  id: string (auto)
  userId: string
  userName: string
  userEmail: string
  college: string
  title: string
  description: string
  category: string (books|lab|tools|projects|other)
  condition: string (excellent|good|fair)
  location: string
  image: string (optional)
  availableFrom: date
  availableTo: date (optional)
  status: string (available|borrowed)
  requests: array[{
    userId: string
    message: string
    createdAt: timestamp
    status: string
  }]
  createdAt: timestamp
}
```

### 5. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Key Features Implementation

### Authentication Flow
1. Users sign up with email, password, full name, and college
2. Credentials stored in Firebase Authentication
3. User profile stored in Firestore
4. Login with email and password
5. Session persists across page refreshes

### Resource Management
1. Users can post resources with:
   - Title and description
   - Category selection
   - Condition status
   - Availability dates
   - Location/pickup point
   - Optional image URL

2. Resources can be filtered by:
   - Category (Books, Lab Equipment, Tools, etc.)
   - College
   - Availability status

3. Request System:
   - Users can request resources
   - Leave messages for resource owners
   - Resource owners can view all requests

### Search & Discovery
- Browse all available resources
- Filter by category and college
- View resource details and owner information
- Request resources with custom messages

## Future Enhancements

- [ ] Advanced search with Gemini recommendations
- [ ] Rating and review system
- [ ] Chat messaging between users
- [ ] Notifications for requests
- [ ] User reputation system
- [ ] Calendar integration for availability
- [ ] Mobile app version
- [ ] Payment integration for rentals
- [ ] Admin dashboard

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Contact & Support

For questions, feedback, or support, please reach out to the development team.

---

**Note**: This is an MVP (Minimum Viable Product) built for a hackathon. Additional features and improvements will be added based on user feedback.
