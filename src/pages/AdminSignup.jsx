import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ROUTES } from '../constants/routes';
import '../styles/auth.css';

export default function AdminSignup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { register, error, loading, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    const { fullName, email, password, confirmPassword, adminCode } = formData;

    if (!fullName || !email || !password || !confirmPassword || !adminCode) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    // Validate admin code (in production, this should be server-side)
    if (adminCode !== 'ADMIN2025') {
      alert('Invalid admin code. Contact system administrator.');
      return;
    }

    try {
      // Register as admin (college is 'Admin' for admins)
      await register(email, password, 'GyanaSetu Admin', fullName, 'admin', '');
      navigate(ROUTES.ADMIN_DASHBOARD);
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="auth-page admin-auth-page">
      <div className="auth-background admin-background">
        <div className="admin-bg-pattern"></div>
      </div>
      <div className="auth-container">
        <div className="auth-card admin-card">
          <div className="auth-header">
            <h1>🔐 Admin Registration</h1>
            <p className="auth-subtitle">Create an administrator account</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Admin Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="admin@gyanasetu.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="adminCode">Admin Authorization Code</label>
              <input
                id="adminCode"
                name="adminCode"
                type="password"
                placeholder="Enter admin authorization code"
                value={formData.adminCode}
                onChange={handleChange}
                disabled={loading}
              />
              <small className="form-hint">Contact system administrator for the code</small>
            </div>

            <button
              type="submit"
              className="admin-button"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Admin Account'}
            </button>
          </form>

          <div className="auth-divider">OR</div>

          <div className="auth-footer">
            <p>Already have an admin account?</p>
            <Link to={ROUTES.ADMIN_LOGIN} className="auth-link-secondary">
              Admin Login
            </Link>
          </div>

          <div className="auth-footer" style={{ marginTop: '1rem' }}>
            <p>Are you a student?</p>
            <Link to={ROUTES.STUDENT_SIGNUP} className="auth-link-secondary">
              Student Signup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
