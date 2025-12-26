import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useResourceStore } from '../store/resourceStore';
import { ROUTES } from '../constants/routes';
import '../styles/student-dashboard.css';

export default function MyRequests() {
  const { user, userProfile, logout } = useAuthStore();
  const { fetchUserResources } = useResourceStore();
  const navigate = useNavigate();

  const [myResources, setMyResources] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('requests');

  // Navigation functions
  const handleGoBack = () => {
    navigate(ROUTES.HOME);
  };

  const handleGoToBrowse = () => {
    navigate(ROUTES.BROWSE_RESOURCES);
  };

  const handleGoToDashboard = () => {
    navigate(ROUTES.STUDENT_DASHBOARD);
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

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="student-dashboard">
      {/* Top Navigation Bar */}
      <div className="page-navigation-bar">
        <button className="nav-back-btn" onClick={handleGoBack} title="Go back to home">
          ← Back
        </button>
        <div className="nav-breadcrumb">
          <span>My Requests</span>
        </div>
        <div className="nav-page-links">
          <button className="nav-link-btn" onClick={handleGoToDashboard} title="Go to dashboard">
            Dashboard
          </button>
          <button className="nav-link-btn" onClick={handleGoToBrowse} title="Go to browse">
            Browse
          </button>
          <button className="nav-link-btn active" disabled>
            Requests
          </button>
        </div>
      </div>

      <div className="dashboard-header">
        <div className="header-content">
          <h1>📋 My Requests</h1>
          <p className="header-subtitle">
            Manage your shared resources and incoming requests
          </p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => navigate(ROUTES.POST_RESOURCE)}>
            ➕ Share Resource
          </button>
          <div className="user-menu">
            <span className="user-name">{userProfile?.fullName}</span>
            <button className="btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
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
