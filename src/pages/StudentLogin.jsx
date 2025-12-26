import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ROUTES } from '../constants/routes';
import '../styles/auth.css';

export default function StudentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, error, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await login(email, password, 'student');
      navigate(ROUTES.STUDENT_DASHBOARD);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="auth-page student-auth-page">
      <div className="auth-background student-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">🎓</div>
            <h1>Student Login</h1>
            <p className="auth-subtitle">Access your resources and connect with peers</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">College Email</label>
              <input
                id="email"
                type="email"
                placeholder="your.name@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner">Logging in...</span>
              ) : (
                'Login as Student'
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>NEW TO GYANASETU?</span>
          </div>

          <div className="auth-links">
            <Link to={ROUTES.STUDENT_SIGNUP} className="auth-link">
              Create Student Account
            </Link>
          </div>

          <div className="auth-footer">
            <p>Are you an admin?</p>
            <Link to={ROUTES.ADMIN_LOGIN} className="auth-link-secondary">
              Admin Login →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
