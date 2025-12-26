import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useResourceStore } from '../store/resourceStore';
import ResourceCard from '../components/ResourceCard';
import ResourcePreviewModal from '../components/ResourcePreviewModal';
import { ROUTES } from '../constants/routes';
import { CATEGORY_LABELS, FILTER_ALL, RESOURCE_CATEGORIES } from '../constants/resources';
import { UI_TEXT } from '../constants/uiText';
import '../styles/student-dashboard.css';

export default function StudentDashboard() {
  const { user, userProfile, logout } = useAuthStore();
  const { resources, fetchResources, searchResources, fetchFavorites } = useResourceStore();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState(FILTER_ALL);
  const [selectedCollege, setSelectedCollege] = useState(
    userProfile?.college || FILTER_ALL
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate(ROUTES.STUDENT_LOGIN);
    }
  }, [user, navigate]);

  useEffect(() => {
    if (userProfile?.college && selectedCollege === FILTER_ALL) {
      setSelectedCollege(userProfile.college);
    }
  }, [userProfile?.college, selectedCollege]);

  useEffect(() => {
    fetchResources({
      category: selectedCategory === FILTER_ALL ? null : selectedCategory,
      college: selectedCollege === FILTER_ALL ? null : selectedCollege,
      status: 'available', // Only show approved resources
    });
    // Load user favorites
    if (user) {
      fetchFavorites(user.uid);
    }
  }, [selectedCategory, selectedCollege, fetchResources, fetchFavorites, user]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim()) {
      searchResources(term);
    } else {
      fetchResources({
        category: selectedCategory === FILTER_ALL ? null : selectedCategory,
        college: selectedCollege === FILTER_ALL ? null : selectedCollege,
        status: 'available', // Only show approved resources
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  const colleges = useMemo(() => {
    const collegeSet = new Set(resources.map((r) => r.college).filter(Boolean));
    if (userProfile?.college) collegeSet.add(userProfile.college);
    return [FILTER_ALL, ...Array.from(collegeSet).sort()];
  }, [resources, userProfile?.college]);

  const categories = RESOURCE_CATEGORIES;

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>🎓 {UI_TEXT.studentDashboardTitle}</h1>
          <p className="header-subtitle">
            {UI_TEXT.welcomeBack}, {userProfile?.fullName || 'Student'}
          </p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => navigate(ROUTES.POST_RESOURCE)}>
            ➕ {UI_TEXT.shareResource}
          </button>
          <div className="user-menu">
            <span className="user-name">{userProfile?.fullName}</span>
            <button className="btn-secondary" onClick={handleLogout}>
              {UI_TEXT.logout}
            </button>
          </div>
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

          <button
            className="btn-secondary"
            onClick={() => {
              setSelectedCategory(FILTER_ALL);
              setSelectedCollege(FILTER_ALL);
              setSearchTerm('');
            }}
          >
            {UI_TEXT.resetFilters}
          </button>

          {/* Stats */}
          <div className="sidebar-stats">
            <div className="stat-box">
              <span className="stat-number">{resources.length}</span>
              <span className="stat-label">{UI_TEXT.resources}</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">
                {resources.reduce((sum, r) => sum + (r.requests?.length || 0), 0)}
              </span>
              <span className="stat-label">{UI_TEXT.requests}</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <div className="resources-section">
            <h2>
              {UI_TEXT.availableResources} ({resources.length})
            </h2>

            {resources.length === 0 ? (
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
