import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { ROUTES } from './constants/routes';

// Pages
import Home from './pages/Home';
import StudentLogin from './pages/StudentLogin';
import StudentSignup from './pages/StudentSignup';
import AdminLogin from './pages/AdminLogin';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PostResource from './pages/PostResource';
import ResourceDetail from './pages/ResourceDetail';
import BrowseResources from './pages/BrowseResources';

import Profile from './pages/Profile';
import ProfileNotifications from './pages/ProfileNotifications';
import ProfilePassword from './pages/ProfilePassword';
import ProfileAccess from './pages/ProfileAccess';
import MyRequests from './pages/MyRequests';

// Legacy routes redirect to the new student/admin flow

const LegacyDashboardRedirect = () => {
  const { userProfile } = useAuthStore();
  if (userProfile?.role === 'admin') {
    return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
  }
  return <Navigate to={ROUTES.STUDENT_DASHBOARD} replace />;
};

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, userProfile, loading } = useAuthStore();

  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  if (requiredRole && userProfile?.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        {/* Profile Page Route */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/notifications"
          element={
            <ProtectedRoute>
              <ProfileNotifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/password"
          element={
            <ProtectedRoute>
              <ProfilePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/access"
          element={
            <ProtectedRoute>
              <ProfileAccess />
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-signup" element={<StudentSignup />} />
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/browse"
          element={
            <ProtectedRoute requiredRole="student">
              <BrowseResources />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <ProtectedRoute requiredRole="student">
              <MyRequests />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Shared Routes */}
        <Route
          path="/post-resource"
          element={
            <ProtectedRoute requiredRole="student">
              <PostResource />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resource/:id"
          element={
            <ProtectedRoute>
              <ResourceDetail />
            </ProtectedRoute>
          }
        />

        {/* Legacy Routes (backward compatibility) */}
        <Route path="/login" element={<Navigate to={ROUTES.STUDENT_LOGIN} replace />} />
        <Route path="/signup" element={<Navigate to={ROUTES.STUDENT_SIGNUP} replace />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <LegacyDashboardRedirect />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
