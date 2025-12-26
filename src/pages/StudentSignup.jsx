import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import '../styles/auth.css';

const COLLEGES = [
  'IIIT Hyderabad',
  'Osmania University',
  'JNTU Hyderabad',
  'BITS Pilani Hyderabad',
  'VNR Vignana Jyothi Institute',
];

export default function StudentSignup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    rollNo: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { register, error: authError, loading } = useAuthStore();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.includes('@')) {
      newErrors.email = 'Valid email is required';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.college) {
      newErrors.college = 'Please select your college';
    }

    if (!formData.rollNo.trim()) {
      newErrors.rollNo = 'Roll number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await register(
        formData.email,
        formData.password,
        formData.college,
        formData.fullName,
        'student',
        formData.rollNo
      );
      navigate('/student-dashboard');
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Join GyanaSetu</h1>
          <p className="auth-subtitle">Create your student account</p>
        </div>

        {authError && <div className="error-message">{authError}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Your full name"
              value={formData.fullName}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.fullName && <small className="error-text">{errors.fullName}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="email">College Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your.name@college.edu"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.email && <small className="error-text">{errors.email}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="college">College</label>
            <select
              id="college"
              name="college"
              value={formData.college}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Select your college</option>
              {COLLEGES.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
            {errors.college && <small className="error-text">{errors.college}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="rollNo">Roll Number</label>
            <input
              id="rollNo"
              name="rollNo"
              type="text"
              placeholder="Your roll number"
              value={formData.rollNo}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.rollNo && <small className="error-text">{errors.rollNo}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
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
            {errors.password && <small className="error-text">{errors.password}</small>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.confirmPassword && <small className="error-text">{errors.confirmPassword}</small>}
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up as Student'}
          </button>
        </form>

        <div className="auth-divider">ALREADY HAVE AN ACCOUNT?</div>

        <div className="auth-links">
          <Link to="/student-login" className="auth-link">
            Login as Student
          </Link>
        </div>

        <div className="auth-footer">
          <p>Looking for admin access?</p>
          <Link to="/admin-login" className="auth-link-secondary">
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}
