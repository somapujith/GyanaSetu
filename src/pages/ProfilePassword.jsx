import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import './Profile.css';
import './ProfileSettings.css';

export default function ProfilePassword() {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const toggleShowPassword = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement password change logic
    alert('Password updated successfully!');
  };

  return (
    <div className="profile-container">
      <aside className="profile-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">📚</span>
            <span className="logo-text">GyanaSetu</span>
          </div>
        </div>
        <div className="sidebar-section">
          <div className="sidebar-label">Profile</div>
          <button className="sidebar-item" onClick={() => navigate(ROUTES.PROFILE)}>
            <ion-icon name="person-outline"></ion-icon>
            <span>Edit Profile</span>
          </button>
          <button className="sidebar-item" onClick={() => navigate('/profile/notifications')}>
            <ion-icon name="notifications-outline"></ion-icon>
            <span>Notifications</span>
          </button>
        </div>
        <div className="sidebar-section">
          <div className="sidebar-label">Secure</div>
          <button className="sidebar-item active" onClick={() => navigate('/profile/password')}>
            <ion-icon name="lock-closed-outline"></ion-icon>
            <span>Password</span>
          </button>
          <button className="sidebar-item" onClick={() => navigate('/profile/access')}>
            <ion-icon name="shield-checkmark-outline"></ion-icon>
            <span>Access</span>
          </button>
        </div>
        <button className="sidebar-delete" onClick={() => navigate(ROUTES.HOME)}>
          <ion-icon name="arrow-back-outline"></ion-icon>
          <span>Back to Home</span>
        </button>
      </aside>

      <main className="profile-main">
        <header className="profile-header">
          <input type="search" placeholder="Search" className="profile-search" />
          <div className="profile-header-actions">
            <button className="header-icon-btn">
              <ion-icon name="help-circle-outline"></ion-icon>
            </button>
            <button className="header-icon-btn">
              <ion-icon name="notifications-outline"></ion-icon>
              <span className="notification-badge">2</span>
            </button>
            <button className="header-avatar" onClick={() => navigate(ROUTES.STUDENT_DASHBOARD)}>
              <img src="https://via.placeholder.com/40" alt="User" />
            </button>
          </div>
        </header>

        <div className="profile-content">
          <h1 className="profile-title">Change Password</h1>

          <div className="settings-layout">
            <section className="profile-card">
              <div className="card-header">
                <h3>Password Settings</h3>
              </div>
              <div className="card-content">
                <form onSubmit={handleSubmit} className="password-form">
                  <div className="form-group">
                    <label>Current Password</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPassword.current ? 'text' : 'password'}
                        name="currentPassword"
                        value={passwords.currentPassword}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => toggleShowPassword('current')}
                      >
                        <ion-icon name={showPassword.current ? 'eye-off-outline' : 'eye-outline'}></ion-icon>
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>New Password</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPassword.new ? 'text' : 'password'}
                        name="newPassword"
                        value={passwords.newPassword}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => toggleShowPassword('new')}
                      >
                        <ion-icon name={showPassword.new ? 'eye-off-outline' : 'eye-outline'}></ion-icon>
                      </button>
                    </div>
                    <p className="input-hint">Must be at least 8 characters</p>
                  </div>

                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPassword.confirm ? 'text' : 'password'}
                        name="confirmPassword"
                        value={passwords.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => toggleShowPassword('confirm')}
                      >
                        <ion-icon name={showPassword.confirm ? 'eye-off-outline' : 'eye-outline'}></ion-icon>
                      </button>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-save">Update Password</button>
                  </div>
                </form>
              </div>
            </section>

            <section className="profile-card">
              <div className="card-header">
                <h3>Password Requirements</h3>
              </div>
              <div className="card-content">
                <ul className="requirements-list">
                  <li>
                    <ion-icon name="checkmark-circle-outline"></ion-icon>
                    <span>At least 8 characters long</span>
                  </li>
                  <li>
                    <ion-icon name="checkmark-circle-outline"></ion-icon>
                    <span>Contains uppercase and lowercase letters</span>
                  </li>
                  <li>
                    <ion-icon name="checkmark-circle-outline"></ion-icon>
                    <span>Contains at least one number</span>
                  </li>
                  <li>
                    <ion-icon name="checkmark-circle-outline"></ion-icon>
                    <span>Contains at least one special character</span>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
