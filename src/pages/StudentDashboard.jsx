import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useResourceStore } from '../store/resourceStore';
import ResourceCard from '../components/ResourceCard';
import ResourcePreviewModal from '../components/ResourcePreviewModal';
import { ROUTES } from '../constants/routes';
import { CATEGORY_LABELS, FILTER_ALL, RESOURCE_CATEGORIES } from '../constants/resources';
import { DEPARTMENTS } from '../constants/departments';
import { YEARS } from '../constants/years';
import { UI_TEXT } from '../constants/uiText';
import '../styles/student-dashboard.css';

export default function StudentDashboard() {
  const { user, userProfile, logout } = useAuthStore();
  const { resources, fetchResources, searchResources, fetchFavorites, favorites } = useResourceStore();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState(FILTER_ALL);
  // Students can only see resources from their own college
  const userCollege = userProfile?.college;
  const [selectedDepartment, setSelectedDepartment] = useState(FILTER_ALL);
  const [selectedYear, setSelectedYear] = useState(FILTER_ALL);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate(ROUTES.STUDENT_LOGIN);
    }
  }, [user, navigate]);

  // No longer needed - students only see their own college

  useEffect(() => {
    // Students can only see resources from their own college
    if (userCollege) {
      fetchResources({
        category: selectedCategory === FILTER_ALL ? null : selectedCategory,
        college: userCollege, // Always filter by user's college
        status: 'available', // Only show approved resources
      });
    }
    // Load user favorites
    if (user) {
      fetchFavorites(user.uid);
    }
  }, [selectedCategory, userCollege, fetchResources, fetchFavorites, user]);

  // Filtered resources
  const filteredResources = useMemo(() => {
    let filtered = [...resources];

    // Apply department filter
    if (selectedDepartment !== FILTER_ALL) {
      filtered = filtered.filter((r) => r.department === selectedDepartment);
    }

    // Apply year filter
    if (selectedYear !== FILTER_ALL) {
      filtered = filtered.filter((r) => r.year === selectedYear);
    }

    // Apply search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title?.toLowerCase().includes(term) ||
          r.description?.toLowerCase().includes(term) ||
          r.category?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [resources, selectedDepartment, selectedYear, searchTerm]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim()) {
      // Search within user's college only
      searchResources(term, { college: userCollege, status: 'available' });
    } else {
      fetchResources({
        category: selectedCategory === FILTER_ALL ? null : selectedCategory,
        college: userCollege, // Always filter by user's college
        status: 'available', // Only show approved resources
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  // Students only see their own college - no college dropdown needed

  const categories = RESOURCE_CATEGORIES;

  // Navigation handlers
  const handleGoHome = () => navigate(ROUTES.HOME);
  const handleGoToBrowse = () => navigate(ROUTES.BROWSE_RESOURCES);
  const handleGoToFavorites = () => navigate(ROUTES.MY_FAVORITES);
  const handleGoToRequests = () => navigate(ROUTES.MY_REQUESTS);
  const handleGoToProfile = () => navigate(ROUTES.PROFILE);
  const handleGoToPost = () => navigate(ROUTES.POST_RESOURCE);

  return (
    <div className="student-dashboard">
      {/* Top Navigation Bar */}
      <nav className="dashboard-nav">
        <div className="nav-brand" onClick={handleGoHome}>
          <span className="brand-icon">📚</span>
          <span className="brand-text">GyanaSetu</span>
        </div>
        
        <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          <button className="nav-link active" onClick={() => setMobileMenuOpen(false)}>
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
          <h1>🎓 {UI_TEXT.studentDashboardTitle}</h1>
          <p className="header-subtitle">
            {UI_TEXT.welcomeBack}, {userProfile?.fullName || 'Student'}
          </p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={handleGoToPost}>
            ➕ {UI_TEXT.shareResource}
          </button>
        </div>
      </div>

      <div className="dashboard-container">
        {/* Sidebar Filters */}
        <aside className="sidebar">
          <h3>{UI_TEXT.filters}</h3>

          <div className="filter-section">
            <h4>{UI_TEXT.search}</h4>
            <input
              type="text"
              placeholder={UI_TEXT.searchPlaceholder}
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>

          <div className="filter-section">
            <h4>{UI_TEXT.category}</h4>
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
            <h4>{UI_TEXT.college}</h4>
            <div className="college-display">
              <ion-icon name="school-outline"></ion-icon>
              <span>{userCollege || 'Loading...'}</span>
            </div>
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
            <h4>Year</h4>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="filter-select"
            >
              <option value={FILTER_ALL}>All Years</option>
              {YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn-secondary"
            onClick={() => {
              setSelectedCategory(FILTER_ALL);
              setSelectedDepartment(FILTER_ALL);
              setSelectedYear(FILTER_ALL);
              setSearchTerm('');
            }}
          >
            {UI_TEXT.resetFilters}
          </button>

          {/* Stats */}
          <div className="sidebar-stats">
            <div className="stat-box">
              <span className="stat-number">{filteredResources.length}</span>
              <span className="stat-label">Filtered Results</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">{resources.length}</span>
              <span className="stat-label">{UI_TEXT.resources}</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <div className="resources-section">
            <h2>
              {UI_TEXT.availableResources} ({filteredResources.length})
            </h2>

            {filteredResources.length === 0 ? (
              <div className="empty-state">
                <p>📚 {UI_TEXT.emptyTitle}</p>
                <p className="empty-subtitle">
                  {UI_TEXT.emptySubtitle}
                </p>
                <button
                  className="btn-primary"
                  onClick={() => navigate(ROUTES.POST_RESOURCE)}
                >
                  {UI_TEXT.emptyCta}
                </button>
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
}
