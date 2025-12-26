import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useResourceStore } from '../store/resourceStore';
import ResourceCard from '../components/ResourceCard';
import '../styles/dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile, logout } = useAuthStore();
  const { resources, fetchResources, loading } = useResourceStore();
  const [filter, setFilter] = useState('all');
  const [college, setCollege] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Fetch resources
    const loadResources = async () => {
      const filters = {};
      if (filter !== 'all') filters.category = filter;
      if (college) filters.college = college;
      await fetchResources(filters);
    };

    loadResources();
  }, [user, filter, college, fetchResources, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Campus Resources</h1>
        </div>
        <div className="header-right">
          <button className="btn-primary" onClick={() => navigate('/post-resource')}>
            + Post Resource
          </button>
          <div className="user-menu">
            <span>{userProfile?.fullName}</span>
            <button onClick={() => navigate('/profile')} className="btn-secondary">
              Profile
            </button>
            <button onClick={handleLogout} className="btn-danger">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <aside className="sidebar">
          <div className="filter-section">
            <h3>Filters</h3>

            <div className="filter-group">
              <label>Category</label>
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All Categories</option>
                <option value="books">Books & Notes</option>
                <option value="lab">Lab Equipment</option>
                <option value="tools">Study Tools</option>
                <option value="projects">Projects & Materials</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="filter-group">
              <label>College</label>
              <select value={college} onChange={(e) => setCollege(e.target.value)}>
                <option value="">All Colleges</option>
                <option value="IIIT Hyderabad">IIIT Hyderabad</option>
                <option value="Osmania University">Osmania University</option>
                <option value="JNTU">JNTU</option>
                <option value="BITS">BITS</option>
                <option value="VNR Vignana Jyothi">VNR Vignana Jyothi</option>
              </select>
            </div>

            <button className="btn-secondary" onClick={() => { setFilter('all'); setCollege(''); }}>
              Reset Filters
            </button>
          </div>

          <div className="quick-stats">
            <h3>Quick Stats</h3>
            <div className="stat-item">
              <span className="stat-label">Total Resources</span>
              <span className="stat-value">{resources.length}</span>
            </div>
          </div>
        </aside>

        <main className="resources-section">
          {loading ? (
            <div className="loading">Loading resources...</div>
          ) : resources.length === 0 ? (
            <div className="empty-state">
              <p>No resources found. Be the first to share one!</p>
              <button className="btn-primary" onClick={() => navigate('/post-resource')}>
                Post a Resource
              </button>
            </div>
          ) : (
            <div className="resources-grid">
              {resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
