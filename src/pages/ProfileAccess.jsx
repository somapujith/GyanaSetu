import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import './Profile.css';
import './ProfileSettings.css';

export default function ProfileAccess() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { showToast } = useToastStore();
  const [loading, setLoading] = useState(false);
  
  // Current session - in a real app this would come from Firebase Auth
  const [sessions, setSessions] = useState([
    {
      id: 'current',
      device: detectDevice(),
      location: 'Current Location',
      lastActive: 'Now',
      current: true,
    },
  ]);

  // Helper function to detect current device
  function detectDevice() {
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/.test(ua)) return 'iOS Device - Safari';
    if (/Android/.test(ua)) return 'Android Device - Chrome';
    if (/Mac/.test(ua)) return 'Mac - ' + (ua.includes('Chrome') ? 'Chrome' : 'Safari');
    if (/Windows/.test(ua)) return 'Windows PC - ' + (ua.includes('Chrome') ? 'Chrome' : ua.includes('Firefox') ? 'Firefox' : 'Edge');
    return 'Unknown Device';
  }

  const handleLogout = async (sessionId) => {
    // For current session, logout the user
    if (sessionId === 'current') {
      await handleLogoutAll();
      return;
    }
    
    // For other sessions, remove from list (in a real app, this would invalidate the session token)
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    showToast('Session logged out successfully', 'success');
  };

  const handleLogoutAll = async () => {
    setLoading(true);
    try {
      await logout();
      showToast('Logged out from all devices', 'success');
      navigate(ROUTES.HOME);
    } catch (error) {
      showToast('Failed to logout: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
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
                  <button className="btn-danger" onClick={handleLogoutAll} disabled={loading}>
                    {loading ? 'Logging out...' : 'Logout from all devices'}
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
