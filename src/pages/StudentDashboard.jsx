import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useResourceStore } from '../store/resourceStore';
import ResourceCard from '../components/ResourceCard';
import '../styles/dashboard.css';

export default function StudentDashboard() {
  const { user, userProfile, logout } = useAuthStore();
  const { resources, fetchResources, searchResources } = useResourceStore();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCollege, setSelectedCollege] = useState(
    userProfile?.college || 'all'
  );
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/student-login');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchResources({
      category: selectedCategory === 'all' ? null : selectedCategory,
      college: selectedCollege === 'all' ? null : selectedCollege,
    });
  }, [selectedCategory, selectedCollege, fetchResources]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim()) {
      searchResources(term);
    } else {
      fetchResources({
        category: selectedCategory === 'all' ? null : selectedCategory,
        college: selectedCollege === 'all' ? null : selectedCollege,
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const colleges = ['all', ...new Set(resources.map((r) => r.college))];
  const categories = [
    'all',
    'books',
    'lab',
    'tools',
    'projects',
    'other',
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>🎓 Student Dashboard</h1>
          <p className="header-subtitle">Welcome back, {userProfile?.fullName}</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => navigate('/post-resource')}>
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
              placeholder="Search resources..."
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
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
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
                  {col === 'all' ? 'All Colleges' : col}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn-secondary"
            onClick={() => {
              setSelectedCategory('all');
              setSelectedCollege('all');
              setSearchTerm('');
            }}
          >
            Reset Filters
          </button>

          {/* Stats */}
          <div className="sidebar-stats">
            <div className="stat-box">
              <span className="stat-number">{resources.length}</span>
              <span className="stat-label">Resources</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">
                {resources.reduce((sum, r) => sum + (r.requests?.length || 0), 0)}
              </span>
              <span className="stat-label">Requests</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <div className="resources-section">
            <h2>Available Resources ({resources.length})</h2>

            {resources.length === 0 ? (
              <div className="empty-state">
                <p>📚 No resources found</p>
                <p className="empty-subtitle">
                  Try adjusting your filters or be the first to share a resource!
                </p>
                <button
                  className="btn-primary"
                  onClick={() => navigate('/post-resource')}
                >
                  Share a Resource
                </button>
              </div>
            ) : (
              <div className="resources-grid">
                {resources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    role="student"
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
