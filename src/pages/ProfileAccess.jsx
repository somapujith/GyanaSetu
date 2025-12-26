import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import './Profile.css';
import './ProfileSettings.css';

export default function ProfileAccess() {
  const navigate = useNavigate();
  const [sessions] = useState([
    {
      id: 1,
      device: 'Windows PC - Chrome',
      location: 'Hyderabad, India',
      lastActive: '2 minutes ago',
      current: true,
    },
    {
      id: 2,
      device: 'iPhone 14 - Safari',
      location: 'Mumbai, India',
      lastActive: '2 hours ago',
      current: false,
    },
    {
      id: 3,
      device: 'MacBook Pro - Chrome',
      location: 'Bangalore, India',
      lastActive: '1 day ago',
      current: false,
    },
  ]);

  const handleLogout = (sessionId) => {
    // TODO: Implement logout logic
    alert(`Logged out session ${sessionId}`);
  };

  const handleLogoutAll = () => {
    // TODO: Implement logout all logic
    alert('Logged out from all devices');
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
          <button className="sidebar-item" onClick={() => navigate('/profile/password')}>
            <ion-icon name="lock-closed-outline"></ion-icon>
            <span>Password</span>
          </button>
          <button className="sidebar-item active" onClick={() => navigate('/profile/access')}>
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
          <h1 className="profile-title">Access & Security</h1>

          <div className="settings-layout">
            <section className="profile-card">
              <div className="card-header">
                <h3>Active Sessions</h3>
                <p className="card-subtitle">Manage your active sessions across all devices</p>
              </div>
              <div className="card-content">
                <div className="sessions-list">
                  {sessions.map(session => (
                    <div key={session.id} className="session-item">
                      <div className="session-icon">
                        <ion-icon name={session.device.includes('iPhone') ? 'phone-portrait-outline' : 'laptop-outline'}></ion-icon>
                      </div>
                      <div className="session-info">
                        <div className="session-device">
                          {session.device}
                          {session.current && <span className="current-badge">Current</span>}
                        </div>
                        <div className="session-location">{session.location}</div>
                        <div className="session-time">Last active: {session.lastActive}</div>
                      </div>
                      {!session.current && (
                        <button 
                          className="session-logout"
                          onClick={() => handleLogout(session.id)}
                        >
                          Logout
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="sessions-actions">
                  <button className="btn-danger" onClick={handleLogoutAll}>
                    Logout from all devices
                  </button>
                </div>
              </div>
            </section>

            <section className="profile-card">
              <div className="card-header">
                <h3>Two-Factor Authentication</h3>
              </div>
              <div className="card-content">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Enable 2FA</h4>
                    <p>Add an extra layer of security to your account</p>
                  </div>
                  <button className="btn-enable">Enable</button>
                </div>
              </div>
            </section>

            <section className="profile-card">
              <div className="card-header">
                <h3>Account Actions</h3>
              </div>
              <div className="card-content">
                <div className="account-actions">
                  <button className="action-btn">
                    <ion-icon name="download-outline"></ion-icon>
                    Download your data
                  </button>
                  <button className="action-btn danger">
                    <ion-icon name="trash-outline"></ion-icon>
                    Delete account
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
