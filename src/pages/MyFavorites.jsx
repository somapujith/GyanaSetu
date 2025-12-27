import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useResourceStore } from '../store/resourceStore';
import ResourceCard from '../components/ResourceCard';
import ResourcePreviewModal from '../components/ResourcePreviewModal';
import { ROUTES } from '../constants/routes';
import '../styles/student-dashboard.css';

export default function MyFavorites() {
  const { user, userProfile, logout } = useAuthStore();
  const { resources, favorites, fetchResources, fetchFavorites } = useResourceStore();
  const navigate = useNavigate();
  const [selectedResource, setSelectedResource] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation functions
  const handleGoHome = () => navigate(ROUTES.HOME);
  const handleGoToDashboard = () => navigate(ROUTES.STUDENT_DASHBOARD);
  const handleGoToRequests = () => navigate(ROUTES.MY_REQUESTS);
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

    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchFavorites(user.uid);
        // Fetch resources from user's college only
        const userCollege = userProfile?.college;
        await fetchResources({ 
          status: 'available',
          college: userCollege // Only show resources from user's college
        });
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, userProfile?.college, navigate, fetchFavorites, fetchResources]);

  // Filter resources to show only favorited ones
  const favoritedResources = resources.filter((r) => favorites.includes(r.id));

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
          <button className="nav-link active" onClick={() => setMobileMenuOpen(false)}>
            <ion-icon name="bookmark-outline"></ion-icon>
            Favorites
            {favorites?.length > 0 && <span className="nav-badge">{favorites.length}</span>}
          </button>
          <button className="nav-link" onClick={handleGoToRequests}>
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
          <h1>⭐ My Favorites</h1>
          <p className="header-subtitle">
            Resources you've bookmarked for quick access
          </p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={handleGoToPost}>
            ➕ Share Resource
          </button>
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
                  Browse resources in Dashboard and click the bookmark icon to save your favorites!
                </p>
                <button className="btn-primary" onClick={handleGoToDashboard}>
                  Go to Dashboard
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
