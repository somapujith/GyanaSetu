import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useResourceStore } from '../store/resourceStore';
import { useToastStore } from '../store/toastStore';
import { ROUTES } from '../constants/routes';
import '../styles/admin-dashboard.css';

export default function AdminDashboard() {
  const { user, userProfile, logout } = useAuthStore();
  const { resources, fetchResources, updateResource, deleteResource } = useResourceStore();
  const { showSuccess, showError } = useToastStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalResources: 0,
    pendingApprovals: 0,
    totalUsers: 0,
    totalRequests: 0,
    activeToday: 0,
  });

  useEffect(() => {
    if (!user || userProfile?.role !== 'admin') {
      navigate(ROUTES.ADMIN_LOGIN);
    }
  }, [user, userProfile, navigate]);

  // Fetch all resources for admin (including pending)
  useEffect(() => {
    if (user && userProfile?.role === 'admin') {
      fetchResources({}); // Fetch all resources without status filter
    }
  }, [user, userProfile, fetchResources]);

  useEffect(() => {
    // Calculate stats
    const totalRequests = resources.reduce(
      (acc, res) => acc + (res.requests?.length || 0),
      0
    );
    const pendingApprovals = resources.filter(
      (res) => res.status === 'pending'
    ).length;

    setStats({
      totalResources: resources.filter((r) => r.status !== 'pending').length,
      pendingApprovals: pendingApprovals,
      totalUsers: 0, // Would fetch from backend
      totalRequests: totalRequests,
      activeToday: 0, // Would track from backend
    });
  }, [resources]);

  const handleApprove = async (resourceId) => {
    try {
      await updateResource(resourceId, { status: 'available' });
      showSuccess('Resource approved successfully!');
    } catch (error) {
      showError('Failed to approve resource');
      console.error(error);
    }
  };

  const handleReject = async (resourceId) => {
    try {
      await deleteResource(resourceId);
      showSuccess('Resource rejected and deleted');
    } catch (error) {
      showError('Failed to reject resource');
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  const getResourcesByCollege = () => {
    const colleges = {};
    resources.forEach((res) => {
      colleges[res.college] = (colleges[res.college] || 0) + 1;
    });
    return colleges;
  };

  const resourcesByCollege = getResourcesByCollege();

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="header-left">
          <h1>🔐 Admin Dashboard</h1>
          <p className="header-subtitle">Manage your GyanaSetu platform</p>
        </div>
        <div className="header-right">
          <div className="admin-profile">
            <span className="admin-email">{userProfile?.email || 'Admin'}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="admin-container">
        <div className="admin-sidebar">
          <nav className="admin-nav">
            <button
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Overview
            </button>
            <button
              className={`nav-item ${activeTab === 'resources' ? 'active' : ''}`}
              onClick={() => setActiveTab('resources')}
            >
              📚 Resources
            </button>
            <button
              className={`nav-item ${activeTab === 'approvals' ? 'active' : ''}`}
              onClick={() => setActiveTab('approvals')}
            >
              ✅ Pending Approvals
            </button>
            <button
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              👥 Users
            </button>
            <button
              className={`nav-item ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              📮 Requests
            </button>
            <button
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              ⚙️ Settings
            </button>
          </nav>
        </div>

        <div className="admin-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="tab-content">
              <h2>Dashboard Overview</h2>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📚</div>
                  <div className="stat-info">
                    <h3>Total Resources</h3>
                    <p className="stat-value">{stats.totalResources}</p>
                  </div>
                </div>

                <div className="stat-card" style={{ border: '2px solid #f59e0b' }}>
                  <div className="stat-icon">⏳</div>
                  <div className="stat-info">
                    <h3>Pending Approvals</h3>
                    <p className="stat-value" style={{ color: '#f59e0b' }}>
                      {stats.pendingApprovals}
                    </p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <h3>Active Users</h3>
                    <p className="stat-value">{stats.totalUsers}</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">📮</div>
                  <div className="stat-info">
                    <h3>Total Requests</h3>
                    <p className="stat-value">{stats.totalRequests}</p>
                  </div>
                </div>
              </div>

              <div className="charts-section">
                <div className="chart-card">
                  <h3>Resources by College</h3>
                  <div className="college-list">
                    {Object.entries(resourcesByCollege).map(([college, count]) => (
                      <div key={college} className="college-item">
                        <span className="college-name">{college}</span>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${(count / stats.totalResources) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="college-count">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="chart-card">
                  <h3>Resource Categories</h3>
                  <div className="category-list">
                    {['books', 'lab', 'tools', 'projects', 'other'].map((cat) => {
                      const count = resources.filter((r) => r.category === cat).length;
                      return count > 0 ? (
                        <div key={cat} className="category-item">
                          <span className="category-name">{cat}</span>
                          <span className="category-count">{count}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="tab-content">
              <h2>Manage Resources</h2>
              <div className="resources-list">
                {resources.filter((r) => r.status !== 'pending').length === 0 ? (
                  <p className="empty-state">No approved resources yet</p>
                ) : (
                  resources
                    .filter((r) => r.status !== 'pending')
                    .map((resource) => (
                      <div key={resource.id} className="resource-item">
                        <div className="resource-header">
                          <h4>{resource.title}</h4>
                          <span className="resource-category">{resource.category}</span>
                        </div>
                        <p className="resource-description">{resource.description}</p>
                        <div className="resource-meta">
                          <span>📍 {resource.location}</span>
                          <span>🏫 {resource.college}</span>
                          <span>📅 {new Date(resource.createdAt?.toDate()).toLocaleDateString()}</span>
                        </div>
                        <div className="resource-actions">
                          <button className="btn-small btn-danger" onClick={() => handleReject(resource.id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {/* Approvals Tab */}
          {activeTab === 'approvals' && (
            <div className="tab-content">
              <h2>Pending Approvals</h2>
              <p className="tab-description">Review and approve resources submitted by students</p>
              
              <div className="resources-list">
                {resources.filter((r) => r.status === 'pending').length === 0 ? (
                  <div className="empty-state">
                    <p>✨ No pending approvals</p>
                    <p className="empty-subtitle">All resources have been reviewed</p>
                  </div>
                ) : (
                  resources
                    .filter((r) => r.status === 'pending')
                    .map((resource) => (
                      <div key={resource.id} className="resource-item pending-item">
                        <div className="resource-header">
                          <h4>{resource.title}</h4>
                          <span className="badge badge-warning">Pending Review</span>
                        </div>
                        <p className="resource-description">{resource.description}</p>
                        
                        <div className="resource-details-grid">
                          <div className="detail-item">
                            <strong>Category:</strong> {resource.category}
                          </div>
                          <div className="detail-item">
                            <strong>Condition:</strong> {resource.condition}
                          </div>
                          <div className="detail-item">
                            <strong>College:</strong> {resource.college}
                          </div>
                          <div className="detail-item">
                            <strong>Department:</strong> {resource.department}
                          </div>
                          <div className="detail-item">
                            <strong>Submitted by:</strong> {resource.userName}
                          </div>
                          <div className="detail-item">
                            <strong>Email:</strong> {resource.userEmail}
                          </div>
                        </div>

                        <div className="resource-meta">
                          <span>📍 {resource.location}</span>
                          <span>📅 Available from: {new Date(resource.availableFrom).toLocaleDateString()}</span>
                          {resource.availableTo && (
                            <span>📅 Until: {new Date(resource.availableTo).toLocaleDateString()}</span>
                          )}
                        </div>

                        {resource.fileUrl && (
                          <div className="file-info-badge">
                            <ion-icon name="document-outline"></ion-icon>
                            <span>{resource.fileName}</span>
                          </div>
                        )}

                        <div className="resource-actions">
                          <button 
                            className="btn-small btn-success" 
                            onClick={() => handleApprove(resource.id)}
                          >
                            ✅ Approve
                          </button>
                          <button 
                            className="btn-small btn-danger" 
                            onClick={() => handleReject(resource.id)}
                          >
                            ❌ Reject
                          </button>
                          {resource.image && (
                            <a 
                              href={resource.image} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="btn-small btn-secondary"
                            >
                              🖼️ View Image
                            </a>
                          )}
                          {resource.fileUrl && (
                            <a 
                              href={resource.fileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="btn-small btn-secondary"
                            >
                              📥 Download File
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="tab-content">
              <h2>Manage Users</h2>
              <div className="users-list">
                <p className="empty-state">User management feature coming soon</p>
              </div>
            </div>
          )}

          {/* Requests Tab */}
          {activeTab === 'requests' && (
            <div className="tab-content">
              <h2>Resource Requests</h2>
              <div className="requests-list">
                {resources.flatMap((res) =>
                  (res.requests || []).map((req, idx) => (
                    <div key={`${res.id}-${idx}`} className="request-item">
                      <div className="request-header">
                        <h4>{res.title}</h4>
                        <span className="request-status">{req.status || 'pending'}</span>
                      </div>
                      <p className="request-message">{req.message}</p>
                      <div className="request-actions">
                        <button className="btn-small btn-success">Approve</button>
                        <button className="btn-small btn-danger">Reject</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="tab-content">
              <h2>Admin Settings</h2>
              <div className="settings-form">
                <div className="setting-group">
                  <h3>Platform Settings</h3>
                  <label>
                    <input type="checkbox" defaultChecked />
                    Allow new student registrations
                  </label>
                  <label>
                    <input type="checkbox" defaultChecked />
                    Enable resource posting
                  </label>
                </div>

                <div className="setting-group">
                  <h3>Moderation</h3>
                  <label>
                    <input type="checkbox" defaultChecked />
                    Auto-approve resource posts
                  </label>
                  <label>
                    <input type="checkbox" defaultChecked />
                    Email admins on new requests
                  </label>
                </div>

                <button className="btn-primary">Save Settings</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
