import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Silk from '../components/Silk';
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
    <div className="auth-page">
      <div className="auth-background">
        <Silk speed={5} scale={1} color="#7B7481" noiseIntensity={1.5} rotation={0} />
      </div>
      <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
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
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login as Student'}
          </button>
        </form>

        <div className="auth-divider">OR</div>

        <div className="auth-links">
          <p>New to GyanaSetu?</p>
          <Link to={ROUTES.STUDENT_SIGNUP} className="auth-link">
            Sign up as Student
          </Link>
        </div>

        <div className="auth-footer">
          <p>Are you an admin?</p>
          <Link to={ROUTES.ADMIN_LOGIN} className="auth-link-secondary">
            Admin Login
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
}
