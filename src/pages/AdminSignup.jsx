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
  const [errors, setErrors] = useState({});
  const { register, error, loading, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const { fullName, email, password, confirmPassword, adminCode } = formData;

    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!email.includes('@')) newErrors.email = 'Valid email is required';
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!adminCode) newErrors.adminCode = 'Admin code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    if (formData.adminCode !== 'ADMIN2025') {
      setErrors(prev => ({ ...prev, adminCode: 'Invalid admin code' }));
      return;
    }

    try {
      await register(formData.email, formData.password, 'GyanaSetu Admin', formData.fullName, 'admin', '');
      navigate(ROUTES.ADMIN_DASHBOARD);
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="auth-page admin-auth-page">
      <div className="auth-background admin-background">
        <div className="admin-grid-pattern"></div>
        <div className="admin-glow"></div>
      </div>
      <div className="auth-container">
        <div className="auth-card admin-card">
          <div className="auth-header">
            <div className="auth-logo admin-logo">🛡️</div>
            <h1>Admin Registration</h1>
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
              {errors.fullName && <small className="error-text">{errors.fullName}</small>}
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
              {errors.email && <small className="error-text">{errors.email}</small>}
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
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <small className="error-text">{errors.password}</small>}
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
              {errors.confirmPassword && <small className="error-text">{errors.confirmPassword}</small>}
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
              {errors.adminCode && <small className="error-text">{errors.adminCode}</small>}
            </div>

            <button
              type="submit"
              className="auth-button admin-button"
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner">Creating Account...</span>
              ) : (
                'Create Admin Account'
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>ALREADY REGISTERED?</span>
          </div>

          <div className="auth-links">
            <Link to={ROUTES.ADMIN_LOGIN} className="auth-link">
              Admin Login
            </Link>
          </div>

          <div className="auth-footer">
            <p>Are you a student?</p>
            <Link to={ROUTES.STUDENT_SIGNUP} className="auth-link-secondary">
              Student Signup →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
