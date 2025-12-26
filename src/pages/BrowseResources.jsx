import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useResourceStore } from '../store/resourceStore';
import ResourceCard from '../components/ResourceCard';
import ResourcePreviewModal from '../components/ResourcePreviewModal';
import { ROUTES } from '../constants/routes';
import { CATEGORY_LABELS, FILTER_ALL, RESOURCE_CATEGORIES } from '../constants/resources';
import { DEPARTMENTS } from '../constants/departments';
import '../styles/student-dashboard.css';

export default function BrowseResources() {
  const { user, userProfile, logout } = useAuthStore();
  const { resources, fetchResources, searchResources, fetchFavorites } = useResourceStore();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState(FILTER_ALL);
  const [selectedCollege, setSelectedCollege] = useState(FILTER_ALL);
  const [selectedDepartment, setSelectedDepartment] = useState(FILTER_ALL);
  const [selectedCondition, setSelectedCondition] = useState(FILTER_ALL);
  const [sortBy, setSortBy] = useState('newest');
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

  const handleGoToFavorites = () => {
    navigate(ROUTES.MY_FAVORITES);
  };

  // Initialize with user's college
  useEffect(() => {
    if (userProfile?.college) {
      setSelectedCollege(userProfile.college);
    }
  }, [userProfile?.college]);

  // Fetch resources and favorites when filters change
  useEffect(() => {
    const loadResources = async () => {
      setIsLoading(true);
      try {
        await fetchResources({
          category: selectedCategory === FILTER_ALL ? null : selectedCategory,
          college: selectedCollege === FILTER_ALL ? null : selectedCollege,
        });
        // Load user's favorites
        if (user) {
          await fetchFavorites(user.uid);
        }
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadResources();
  }, [selectedCategory, selectedCollege, fetchResources, fetchFavorites, user]);

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
  const conditions = [FILTER_ALL, 'excellent', 'good', 'fair', 'used'];

  // Filtered and sorted resources
  const filteredResources = useMemo(() => {
    let filtered = [...resources];

    // Apply search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title?.toLowerCase().includes(term) ||
          r.description?.toLowerCase().includes(term) ||
          r.college?.toLowerCase().includes(term) ||
          r.department?.toLowerCase().includes(term) ||
          r.userName?.toLowerCase().includes(term)
      );
    }

    // Apply category filter
    if (selectedCategory !== FILTER_ALL) {
      filtered = filtered.filter((r) => r.category === selectedCategory);
    }

    // Apply college filter
    if (selectedCollege !== FILTER_ALL) {
      filtered = filtered.filter((r) => r.college === selectedCollege);
    }

    // Apply department filter
    if (selectedDepartment !== FILTER_ALL) {
      filtered = filtered.filter((r) => r.department === selectedDepartment);
    }

    // Apply condition filter
    if (selectedCondition !== FILTER_ALL) {
      filtered = filtered.filter((r) => r.condition === selectedCondition);
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'title-asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'college':
        filtered.sort((a, b) => a.college.localeCompare(b.college));
        break;
      default:
        break;
    }

    return filtered;
  }, [resources, searchTerm, selectedCategory, selectedCollege, selectedDepartment, selectedCondition, sortBy]);

  // Reset filters
  const resetFilters = () => {
    setSelectedCategory(FILTER_ALL);
    setSelectedCollege(userProfile?.college || FILTER_ALL);
    setSelectedDepartment(FILTER_ALL);
    setSelectedCondition(FILTER_ALL);
    setSortBy('newest');
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
          <button className="nav-link-btn" onClick={handleGoToFavorites} title="Go to favorites">
            Favorites
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
              placeholder="Search by title, description, college..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-section">
            <h4>Sort By</h4>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="college">College Name</option>
            </select>
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

          <div className="filter-section">
            <h4>Department</h4>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="filter-select"
            >
              <option value={FILTER_ALL}>All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <h4>Condition</h4>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="filter-select"
            >
              {conditions.map((cond) => (
                <option key={cond} value={cond}>
                  {cond === FILTER_ALL ? 'All Conditions' : cond.charAt(0).toUpperCase() + cond.slice(1)}
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
              <span className="stat-number">{filteredResources.length}</span>
              <span className="stat-label">Filtered Results</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">{resources.length}</span>
              <span className="stat-label">Total Resources</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <div className="resources-section">
            <h2>
              Available Resources ({isLoading ? '...' : filteredResources.length})
            </h2>

            {filteredResources.length === 0 && !isLoading ? (
              <div className="empty-state">
                <p>📚 No resources found</p>
                <p className="empty-subtitle">
                  {searchTerm || selectedCategory !== FILTER_ALL || selectedCollege !== FILTER_ALL 
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
                {filteredResources.map((resource) => (
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
}    </div>
  );
}
