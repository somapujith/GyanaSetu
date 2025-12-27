import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useResourceStore } from '../store/resourceStore';
import { ROUTES } from '../constants/routes';
import '../styles/student-dashboard.css';

export default function MyRequests() {
  const { user, userProfile, logout } = useAuthStore();
  const { fetchUserResources, favorites } = useResourceStore();
  const navigate = useNavigate();

  const [myResources, setMyResources] = useState([]);
  const [pendingResources, setPendingResources] = useState([]);
  const [approvedResources, setApprovedResources] = useState([]);
  const [rejectedResources, setRejectedResources] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation functions
  const handleGoHome = () => navigate(ROUTES.HOME);
  const handleGoToDashboard = () => navigate(ROUTES.STUDENT_DASHBOARD);
  const handleGoToBrowse = () => navigate(ROUTES.BROWSE_RESOURCES);
  const handleGoToFavorites = () => navigate(ROUTES.MY_FAVORITES);
  const handleGoToProfile = () => navigate(ROUTES.PROFILE);
  const handleGoToPost = () => navigate(ROUTES.POST_RESOURCE);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  useEffect(() => {
    if (!user) {
      navigate(ROUTES.STUDENT_LOGIN);
      return;
    }

    const loadUserResources = async () => {
      setIsLoading(true);
      try {
        const userResources = await fetchUserResources(user.uid);
        setMyResources(userResources || []);

        // Separate resources by status
        const pending = userResources?.filter(r => r.status === 'pending') || [];
        const approved = userResources?.filter(r => r.status === 'approved') || [];
        const rejected = userResources?.filter(r => r.status === 'rejected') || [];

        setPendingResources(pending);
        setApprovedResources(approved);
        setRejectedResources(rejected);
      } catch (error) {
        console.error('Error loading user resources:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserResources();
  }, [user, fetchUserResources, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="student-dashboard">
      {/* Top Navigation Bar */}
      <nav className="dashboard-nav">
        <div className="nav-brand" onClick={handleGoHome}>
          <span className="brand-icon">📚</span>
          <span className="brand-text">GyanaSetu</span>
        </div>
        
        <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          <button className="nav-link" onClick={handleGoToDashboard}>
            <ion-icon name="grid-outline"></ion-icon>
            Dashboard
          </button>
          <button className="nav-link" onClick={handleGoToBrowse}>
            <ion-icon name="search-outline"></ion-icon>
            Browse
          </button>
          <button className="nav-link" onClick={handleGoToFavorites}>
            <ion-icon name="bookmark-outline"></ion-icon>
            Favorites
            {favorites?.length > 0 && <span className="nav-badge">{favorites.length}</span>}
          </button>
          <button className="nav-link active" onClick={() => setMobileMenuOpen(false)}>
            <ion-icon name="mail-outline"></ion-icon>
            My Requests
          </button>
          <button className="nav-link" onClick={handleGoToPost}>
            <ion-icon name="add-circle-outline"></ion-icon>
            Share Resource
          </button>
        </div>

        <div className="nav-actions">
          <button className="nav-icon-btn" onClick={handleGoToProfile} title="Profile">
            <ion-icon name="person-circle-outline"></ion-icon>
          </button>
          <button className="nav-icon-btn logout" onClick={handleLogout} title="Logout">
            <ion-icon name="log-out-outline"></ion-icon>
          </button>
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <ion-icon name={mobileMenuOpen ? 'close-outline' : 'menu-outline'}></ion-icon>
          </button>
        </div>
      </nav>

      <div className="dashboard-header">
        <div className="header-content">
          <h1>📋 My Requests</h1>
          <p className="header-subtitle">
            Track your submitted resources and approval status
          </p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={handleGoToPost}>
            ➕ Share Resource
          </button>
        </div>
      </div>

      <div className="dashboard-container">
        <aside className="sidebar">
          <h3>Navigation</h3>

          <div className="filter-section">
            <h4>Status</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                className={activeTab === 'pending' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setActiveTab('pending')}
                style={{ width: '100%' }}
              >
                ⏳ Pending ({pendingResources.length})
              </button>
              <button
                className={activeTab === 'approved' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setActiveTab('approved')}
                style={{ width: '100%' }}
              >
                ✅ Approved ({approvedResources.length})
              </button>
              <button
                className={activeTab === 'rejected' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setActiveTab('rejected')}
                style={{ width: '100%' }}
              >
                ❌ Rejected ({rejectedResources.length})
              </button>
            </div>
          </div>

          <div className="sidebar-stats">
            <div className="stat-box">
              <span className="stat-number">{myResources.length}</span>
              <span className="stat-label">Total Submitted</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">{pendingResources.length}</span>
              <span className="stat-label">Pending Approval</span>
            </div>
          </div>
        </aside>

        <main className="main-content">
          {activeTab === 'pending' && (
            <div className="resources-section">
              <h2>⏳ Pending Approval ({isLoading ? '...' : pendingResources.length})</h2>

              {isLoading ? (
                <div className="empty-state">
                  <p>⏳ Loading resources...</p>
                </div>
              ) : pendingResources.length === 0 ? (
                <div className="empty-state">
                  <p>📭 No pending resources</p>
                  <p className="empty-subtitle">
                    Resources you submit will appear here while waiting for admin approval
                  </p>
                  <button className="btn-primary" onClick={handleGoToPost}>
                    Share Your First Resource
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {pendingResources.map((resource) => (
                    <div
                      key={resource.id}
                      style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid #fef3c7',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600 }}>
                            {resource.title}
                          </h4>
                          <p style={{ margin: '0', fontSize: '13px', color: '#666' }}>
                            {resource.college} {resource.department && `• ${resource.department}`}
                          </p>
                        </div>
                        <span
                          style={{
                            display: 'inline-block',
                            background: '#fef3c7',
                            color: '#d97706',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 600,
                            height: 'fit-content',
                          }}
                        >
                          ⏳ Pending
                        </span>
                      </div>

                      <p style={{ margin: '12px 0', fontSize: '14px', color: '#555', lineHeight: '1.5' }}>
                        {resource.description}
                      </p>

                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '12px', color: '#999', marginTop: '12px' }}>
                        <span>📂 {resource.category}</span>
                        <span>•</span>
                        <span>📅 {resource.createdAt ? new Date(resource.createdAt.toDate()).toLocaleDateString() : 'N/A'}</span>
                      </div>

                      {resource.driveLink && (
                        <a
                          href={resource.driveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ 
                            display: 'inline-block',
                            marginTop: '12px',
                            color: '#6366f1',
                            fontSize: '13px',
                            textDecoration: 'none'
                          }}
                        >
                          🔗 View File
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'approved' && (
            <div className="resources-section">
              <h2>✅ Approved Resources ({isLoading ? '...' : approvedResources.length})</h2>

              {isLoading ? (
                <div className="empty-state">
                  <p>⏳ Loading resources...</p>
                </div>
              ) : approvedResources.length === 0 ? (
                <div className="empty-state">
                  <p>📭 No approved resources yet</p>
                  <p className="empty-subtitle">
                    Resources approved by admin will appear here
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {approvedResources.map((resource) => (
                    <div
                      key={resource.id}
                      style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid #d1fae5',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600 }}>
                            {resource.title}
                          </h4>
                          <p style={{ margin: '0', fontSize: '13px', color: '#666' }}>
                            {resource.college} {resource.department && `• ${resource.department}`}
                          </p>
                        </div>
                        <span
                          style={{
                            display: 'inline-block',
                            background: '#d1fae5',
                            color: '#059669',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 600,
                            height: 'fit-content',
                          }}
                        >
                          ✅ Approved
                        </span>
                      </div>

                      <p style={{ margin: '12px 0', fontSize: '14px', color: '#555', lineHeight: '1.5' }}>
                        {resource.description}
                      </p>

                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '12px', color: '#999', marginTop: '12px' }}>
                        <span>📂 {resource.category}</span>
                        <span>•</span>
                        <span>📅 {resource.createdAt ? new Date(resource.createdAt.toDate()).toLocaleDateString() : 'N/A'}</span>
                        <span>•</span>
                        <span>👁️ {resource.views || 0} views</span>
                      </div>

                      {resource.driveLink && (
                        <a
                          href={resource.driveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ 
                            display: 'inline-block',
                            marginTop: '12px',
                            color: '#6366f1',
                            fontSize: '13px',
                            textDecoration: 'none'
                          }}
                        >
                          🔗 View File
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'rejected' && (
            <div className="resources-section">
              <h2>❌ Rejected Resources ({isLoading ? '...' : rejectedResources.length})</h2>

              {isLoading ? (
                <div className="empty-state">
                  <p>⏳ Loading resources...</p>
                </div>
              ) : rejectedResources.length === 0 ? (
                <div className="empty-state">
                  <p>✨ No rejected resources</p>
                  <p className="empty-subtitle">
                    This is good! Keep submitting quality resources
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {rejectedResources.map((resource) => (
                    <div
                      key={resource.id}
                      style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid #fee2e2',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600 }}>
                            {resource.title}
                          </h4>
                          <p style={{ margin: '0', fontSize: '13px', color: '#666' }}>
                            {resource.college} {resource.department && `• ${resource.department}`}
                          </p>
                        </div>
                        <span
                          style={{
                            display: 'inline-block',
                            background: '#fee2e2',
                            color: '#dc2626',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 600,
                            height: 'fit-content',
                          }}
                        >
                          ❌ Rejected
                        </span>
                      </div>

                      <p style={{ margin: '12px 0', fontSize: '14px', color: '#555', lineHeight: '1.5' }}>
                        {resource.description}
                      </p>

                      {resource.rejectionReason && (
                        <div style={{ 
                          margin: '12px 0',
                          padding: '12px',
                          background: '#fef2f2',
                          borderLeft: '3px solid #dc2626',
                          borderRadius: '4px'
                        }}>
                          <p style={{ margin: 0, fontSize: '13px', color: '#dc2626', fontWeight: 600 }}>
                            Rejection Reason:
                          </p>
                          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#991b1b' }}>
                            {resource.rejectionReason}
                          </p>
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '12px', color: '#999', marginTop: '12px' }}>
                        <span>📂 {resource.category}</span>
                        <span>•</span>
                        <span>📅 {resource.createdAt ? new Date(resource.createdAt.toDate()).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
