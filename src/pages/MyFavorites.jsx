import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useResourceStore } from '../store/resourceStore';
import ResourceCard from '../components/ResourceCard';
import ResourcePreviewModal from '../components/ResourcePreviewModal';
import { ROUTES } from '../constants/routes';
import { useState } from 'react';
import '../styles/student-dashboard.css';

export default function MyFavorites() {
  const { user, userProfile, logout } = useAuthStore();
  const { resources, favorites, fetchResources, fetchFavorites } = useResourceStore();
  const navigate = useNavigate();
  const [selectedResource, setSelectedResource] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Navigation functions
  const handleGoBack = () => {
    navigate(ROUTES.HOME);
  };

  const handleGoToDashboard = () => {
    navigate(ROUTES.STUDENT_DASHBOARD);
  };

  const handleGoToBrowse = () => {
    navigate(ROUTES.BROWSE_RESOURCES);
  };

  const handleGoToRequests = () => {
    navigate(ROUTES.MY_REQUESTS);
  };

  useEffect(() => {
    if (!user) {
      navigate(ROUTES.STUDENT_LOGIN);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchFavorites(user.uid);
        await fetchResources();
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, navigate, fetchFavorites, fetchResources]);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  // Filter resources to show only favorited ones
  const favoritedResources = resources.filter((r) => favorites.includes(r.id));

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
          <span>My Favorites</span>
        </div>
        <div className="nav-page-links">
          <button className="nav-link-btn" onClick={handleGoToDashboard} title="Go to dashboard">
            Dashboard
          </button>
          <button className="nav-link-btn" onClick={handleGoToBrowse} title="Go to browse">
            Browse
          </button>
          <button className="nav-link-btn" onClick={handleGoToRequests} title="Go to requests">
            Requests
          </button>
          <button className="nav-link-btn active" disabled>
            Favorites
          </button>
        </div>
      </div>

      <div className="dashboard-header">
        <div className="header-content">
          <h1>⭐ My Favorites</h1>
          <p className="header-subtitle">
            Resources you've bookmarked for quick access
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
        <main className="main-content" style={{ width: '100%' }}>
          <div className="resources-section">
            <h2>
              Favorited Resources ({isLoading ? '...' : favoritedResources.length})
            </h2>

            {favoritedResources.length === 0 && !isLoading ? (
              <div className="empty-state">
                <p>⭐ No favorites yet</p>
                <p className="empty-subtitle">
                  Browse resources and click the bookmark icon to save your favorites!
                </p>
                <button className="btn-primary" onClick={handleGoToBrowse}>
                  Browse Resources
                </button>
              </div>
            ) : isLoading ? (
              <div className="empty-state">
                <p>⏳ Loading favorites...</p>
              </div>
            ) : (
              <div className="resources-grid">
                {favoritedResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    role="student"
                    onPreview={() => setSelectedResource(resource)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Resource Preview Modal */}
      {selectedResource && (
        <ResourcePreviewModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}
    </div>
  );
}
