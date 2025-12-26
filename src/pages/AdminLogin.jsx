import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ROUTES } from '../constants/routes';
import '../styles/auth.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, error, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !adminCode) {
      alert('Please fill in all fields');
      return;
    }

    // Validate admin code (in production, verify on backend)
    if (adminCode !== 'ADMIN2025') {
      alert('Invalid admin code');
      return;
    }

    try {
      await login(email, password, 'admin');
      navigate(ROUTES.ADMIN_DASHBOARD);
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
      <div className="auth-card admin-card">
        <div className="auth-header">
          <h1>🔐 Admin Login</h1>
          <p className="auth-subtitle">Manage platform resources and users</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Admin Email</label>
            <input
              id="email"
              type="email"
              placeholder="admin@gyanasetu.com"
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

          <div className="form-group">
            <label htmlFor="adminCode">Admin Code</label>
            <input
              id="adminCode"
              type="password"
              placeholder="Enter admin code"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              disabled={loading}
            />
            <small className="form-hint">Check your email for admin code</small>
          </div>

          <button
            type="submit"
            className="admin-button"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Login as Admin'}
          </button>
        </form>

        <div className="auth-divider">OR</div>

        <div className="auth-footer">
          <p>Are you a student?</p>
          <Link to={ROUTES.STUDENT_LOGIN} className="auth-link-secondary">
            Student Login
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
}
