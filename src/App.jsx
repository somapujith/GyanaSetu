import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Pages
import Home from './pages/Home';
import StudentLogin from './pages/StudentLogin';
import StudentSignup from './pages/StudentSignup';
import AdminLogin from './pages/AdminLogin';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PostResource from './pages/PostResource';
import ResourceDetail from './pages/ResourceDetail';

// Legacy imports (backward compatibility)
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';

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
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
