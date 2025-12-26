import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useResourceStore } from '../store/resourceStore';
import ResourceCard from '../components/ResourceCard';
import ResourcePreviewModal from '../components/ResourcePreviewModal';
import { ROUTES } from '../constants/routes';
import { CATEGORY_LABELS, FILTER_ALL, RESOURCE_CATEGORIES } from '../constants/resources';
import '../styles/student-dashboard.css';

export default function BrowseResources() {
  const { user, userProfile, logout } = useAuthStore();
  const { resources, fetchResources, searchResources } = useResourceStore();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState(FILTER_ALL);
  const [selectedCollege, setSelectedCollege] = useState(FILTER_ALL);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Navigation functions
  const handleGoBack = () => {
    navigate(ROUTES.HOME);
  };

  const handleGoToRequests = () => {
    navigate(ROUTES.MY_REQUESTS);
  };

  const handleGoToDashboard = () => {
    navigate(ROUTES.STUDENT_DASHBOARD);
  };

  // Initialize with user's college
  useEffect(() => {
    if (userProfile?.college) {
      setSelectedCollege(userProfile.college);
    }
  }, [userProfile?.college]);

  // Fetch resources when filters change
  useEffect(() => {
    const loadResources = async () => {
      setIsLoading(true);
      try {
        await fetchResources({
          category: selectedCategory === FILTER_ALL ? null : selectedCategory,
          college: selectedCollege === FILTER_ALL ? null : selectedCollege,
        });
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadResources();
  }, [selectedCategory, selectedCollege, fetchResources]);

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim()) {
      searchResources(term);
    } else {
      fetchResources({
        category: selectedCategory === FILTER_ALL ? null : selectedCategory,
        college: selectedCollege === FILTER_ALL ? null : selectedCollege,
      });
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  // Get unique colleges from resources
  const colleges = useMemo(() => {
    const collegeSet = new Set(resources.map((r) => r.college).filter(Boolean));
    if (userProfile?.college) collegeSet.add(userProfile.college);
    return [FILTER_ALL, ...Array.from(collegeSet).sort()];
  }, [resources, userProfile?.college]);

  const categories = RESOURCE_CATEGORIES;

  // Reset filters
  const resetFilters = () => {
    setSelectedCategory(FILTER_ALL);
    setSelectedCollege(userProfile?.college || FILTER_ALL);
    setSearchTerm('');
  };

  if (!user) {
    navigate(ROUTES.STUDENT_LOGIN);
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
          <span>Browse Resources</span>
        </div>
        <div className="nav-page-links">
          <button className="nav-link-btn" onClick={handleGoToDashboard} title="Go to dashboard">
            Dashboard
          </button>
          <button className="nav-link-btn active" disabled>
            Browse
          </button>
          <button className="nav-link-btn" onClick={handleGoToRequests} title="Go to requests">
            Requests
          </button>
        </div>
      </div>

      <div className="dashboard-header">
        <div className="header-content">
          <h1>🔍 Browse Resources</h1>
          <p className="header-subtitle">
            Discover resources shared by your peers across all colleges
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
        {/* Sidebar Filters */}
        <aside className="sidebar">
          <h3>Filters</h3>

          <div className="filter-section">
            <h4>Search</h4>
            <input
              type="text"
              placeholder="Search by title, college..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>

          <div className="filter-section">
            <h4>Category</h4>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat] || cat}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <h4>College</h4>
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="filter-select"
            >
              {colleges.map((col) => (
                <option key={col} value={col}>
                  {col === FILTER_ALL ? 'All colleges' : col}
                </option>
              ))}
            </select>
          </div>

          <button className="btn-secondary" onClick={resetFilters} style={{ width: '100%' }}>
            Reset Filters
          </button>

          {/* Stats */}
          <div className="sidebar-stats">
            <div className="stat-box">
              <span className="stat-number">{resources.length}</span>
              <span className="stat-label">Resources</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <div className="resources-section">
            <h2>
              Available Resources ({isLoading ? '...' : resources.length})
            </h2>

            {resources.length === 0 && !isLoading ? (
              <div className="empty-state">
                <p>📚 No resources found</p>
                <p className="empty-subtitle">
                  {searchTerm 
                    ? 'Try different search terms or adjust filters'
                    : 'Try adjusting your filters or be the first to share a resource!'}
                </p>
                <button
                  className="btn-primary"
                  onClick={() => navigate(ROUTES.POST_RESOURCE)}
                >
                  Share Your First Resource
                </button>
              </div>
            ) : isLoading ? (
              <div className="empty-state">
                <p>⏳ Loading resources...</p>
              </div>
            ) : (
              <div className="resources-grid">
                {resources.map((resource) => (
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
