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
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('requests');
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

        const allRequests = userResources?.reduce((acc, resource) => {
          const requests = resource.requests || [];
          return [
            ...acc,
            ...requests.map((req) => ({
              ...req,
              resourceId: resource.id,
              resourceTitle: resource.title,
              resourceType: resource.category,
            })),
          ];
        }, []) || [];

        allRequests.sort(
          (a, b) =>
            new Date(b.submittedAt || 0).getTime() -
            new Date(a.submittedAt || 0).getTime()
        );

        setIncomingRequests(allRequests);
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
            Manage your shared resources and incoming requests
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
            <h4>View</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                className={activeTab === 'requests' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setActiveTab('requests')}
                style={{ width: '100%' }}
              >
                Incoming Requests
              </button>
              <button
                className={activeTab === 'resources' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setActiveTab('resources')}
                style={{ width: '100%' }}
              >
                My Resources
              </button>
            </div>
          </div>

          <div className="sidebar-stats">
            <div className="stat-box">
              <span className="stat-number">{myResources.length}</span>
              <span className="stat-label">Resources Shared</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">{incomingRequests.length}</span>
              <span className="stat-label">Requests</span>
            </div>
          </div>
        </aside>

        <main className="main-content">
          {activeTab === 'requests' ? (
            <div className="resources-section">
              <h2>
                Incoming Requests ({isLoading ? '...' : incomingRequests.length})
              </h2>

              {isLoading ? (
                <div className="empty-state">
                  <p>⏳ Loading requests...</p>
                </div>
              ) : incomingRequests.length === 0 ? (
                <div className="empty-state">
                  <p>📭 No requests yet</p>
                  <p className="empty-subtitle">
                    When someone requests your shared resource, it will appear here
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {incomingRequests.map((request, idx) => (
                    <div
                      key={`${request.resourceId}-${idx}`}
                      style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid rgba(0,0,0,0.04)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div>
                          <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600 }}>
                            {request.resourceTitle}
                          </h4>
                          <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                            By: {request.studentName || 'Anonymous'}
                          </p>
                        </div>
                        <span
                          style={{
                            display: 'inline-block',
                            background: '#f0f4ff',
                            color: '#6366f1',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 600,
                          }}
                        >
                          {request.resourceType}
                        </span>
                      </div>

                      {request.message && (
                        <p style={{ margin: '12px 0', fontSize: '13px', color: '#555', fontStyle: 'italic' }}>
                          "{request.message}"
                        </p>
                      )}

                      <div style={{ fontSize: '12px', color: '#999', marginBottom: '16px' }}>
                        📅{' '}
                        {request.submittedAt
                          ? new Date(request.submittedAt).toLocaleDateString()
                          : 'Date unknown'}
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn-primary"
                          style={{ padding: '8px 16px', fontSize: '12px', flex: 1 }}
                        >
                          ✓ Approve
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ padding: '8px 16px', fontSize: '12px', flex: 1 }}
                        >
                          ✕ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="resources-section">
              <h2>My Shared Resources ({myResources.length})</h2>

              {isLoading ? (
                <div className="empty-state">
                  <p>⏳ Loading resources...</p>
                </div>
              ) : myResources.length === 0 ? (
                <div className="empty-state">
                  <p>📦 No resources shared yet</p>
                  <p className="empty-subtitle">
                    Start sharing resources with your peers to help the community grow
                  </p>
                  <button
                    className="btn-primary"
                    onClick={() => navigate(ROUTES.POST_RESOURCE)}
                  >
                    Share Your First Resource
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {myResources.map((resource) => (
                    <div
                      key={resource.id}
                      style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid rgba(0,0,0,0.04)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div>
                          <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600 }}>
                            {resource.title}
                          </h4>
                          <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                            {resource.college}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              background: '#f0f4ff',
                              color: '#6366f1',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 600,
                            }}
                          >
                            {resource.category}
                          </span>
                          {resource.requests && (
                            <span
                              style={{
                                display: 'inline-block',
                                background: '#fff4e6',
                                color: '#d97706',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: 600,
                              }}
                            >
                              {resource.requests.length} requests
                            </span>
                          )}
                        </div>
                      </div>

                      <p style={{ margin: '12px 0', fontSize: '13px', color: '#555', maxHeight: '60px', overflow: 'hidden' }}>
                        {resource.description}
                      </p>

                      <div style={{ fontSize: '12px', color: '#999', marginBottom: '16px' }}>
                        📅 {new Date(resource.createdAt).toLocaleDateString()}
                      </div>

                      <button
                        className="btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '12px' }}
                      >
                        🗑️ Delete
                      </button>
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
