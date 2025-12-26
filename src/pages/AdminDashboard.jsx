import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useResourceStore } from '../store/resourceStore';
import { useToastStore } from '../store/toastStore';
import { uploadResourceFile } from '../services/storage';
import { ROUTES } from '../constants/routes';
import { CATEGORY_LABELS, RESOURCE_CATEGORIES } from '../constants/resources';
import { COLLEGES } from '../constants/colleges';
import { DEPARTMENTS } from '../constants/departments';
import '../styles/admin-dashboard.css';

export default function AdminDashboard() {
  const { user, userProfile, logout } = useAuthStore();
  const { resources, fetchResources, createResource, updateResource, deleteResource } = useResourceStore();
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

  // Add Resource Form State
  const [resourceForm, setResourceForm] = useState({
    title: '',
    description: '',
    category: 'books',
    condition: 'good',
    college: '',
    department: '',
    location: '',
    availableFrom: new Date().toISOString().split('T')[0],
    availableTo: '',
    tags: '',
  });
  const [resourceFile, setResourceFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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

  // Add Resource Form Handlers
  const handleResourceFormChange = (e) => {
    const { name, value } = e.target;
    setResourceForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (selectedFile.size > maxSize) {
      showError('File size must be less than 50MB');
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'video/mp4',
      'image/jpeg',
      'image/png',
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      showError('Invalid file type. Allowed: PDF, DOC, DOCX, PPT, PPTX, MP4, JPG, PNG');
      return;
    }

    setResourceFile(selectedFile);

    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  };

  const removeFile = () => {
    setResourceFile(null);
    setFilePreview(null);
    setUploadProgress(0);
  };

  const resetResourceForm = () => {
    setResourceForm({
      title: '',
      description: '',
      category: 'books',
      condition: 'good',
      college: '',
      department: '',
      location: '',
      availableFrom: new Date().toISOString().split('T')[0],
      availableTo: '',
      tags: '',
    });
    setResourceFile(null);
    setFilePreview(null);
    setUploadProgress(0);
  };

  const handleAddResource = async (e) => {
    e.preventDefault();

    // Validation
    if (!resourceForm.title.trim()) {
      showError('Please enter a title');
      return;
    }
    if (!resourceForm.description.trim()) {
      showError('Please enter a description');
      return;
    }
    if (!resourceForm.college) {
      showError('Please select a college');
      return;
    }
    if (!resourceForm.department) {
      showError('Please select a department');
      return;
    }

    try {
      setUploading(true);
      
      let fileUrl = null;
      let fileName = null;

      if (resourceFile) {
        const uploadResult = await uploadResourceFile(resourceFile, (progress) => {
          setUploadProgress(progress);
        });
        fileUrl = uploadResult.url;
        fileName = uploadResult.fileName;
      }

      const resourceData = {
        ...resourceForm,
        fileUrl,
        fileName,
        tags: resourceForm.tags.split(',').map(t => t.trim()).filter(t => t),
        status: 'available', // Admin resources are auto-approved
        userId: user.uid,
        userName: userProfile?.fullName || 'Admin',
        userEmail: userProfile?.email || 'admin@gyanasetu.com',
        views: 0,
        downloads: 0,
      };

      await createResource(resourceData);
      showSuccess('Resource added successfully!');
      resetResourceForm();
      setActiveTab('resources'); // Switch to resources tab to see the new resource
    } catch (error) {
      console.error('Error adding resource:', error);
      showError('Failed to add resource. Please try again.');
    } finally {
      setUploading(false);
    }
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
              className={`nav-item ${activeTab === 'add-resource' ? 'active' : ''}`}
              onClick={() => setActiveTab('add-resource')}
            >
              ➕ Add Resource
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
              {stats.pendingApprovals > 0 && (
                <span className="nav-badge">{stats.pendingApprovals}</span>
              )}
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

          {/* Add Resource Tab */}
          {activeTab === 'add-resource' && (
            <div className="tab-content">
              <div className="add-resource-header">
                <h2>➕ Add New Resource</h2>
                <p className="tab-description">Upload resources directly to the platform. Admin uploads are auto-approved.</p>
              </div>

              <form className="admin-resource-form" onSubmit={handleAddResource}>
                <div className="form-grid">
                  {/* Left Column */}
                  <div className="form-column">
                    <div className="form-section">
                      <h3>📝 Basic Information</h3>
                      
                      <div className="form-group">
                        <label htmlFor="title">Resource Title *</label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={resourceForm.title}
                          onChange={handleResourceFormChange}
                          placeholder="e.g., Data Structures & Algorithms Notes"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="description">Description *</label>
                        <textarea
                          id="description"
                          name="description"
                          value={resourceForm.description}
                          onChange={handleResourceFormChange}
                          placeholder="Provide a detailed description of the resource..."
                          rows={4}
                          required
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="category">Category *</label>
                          <select
                            id="category"
                            name="category"
                            value={resourceForm.category}
                            onChange={handleResourceFormChange}
                          >
                            {RESOURCE_CATEGORIES.filter(c => c !== 'all').map((cat) => (
                              <option key={cat} value={cat}>
                                {CATEGORY_LABELS[cat] || cat}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group">
                          <label htmlFor="condition">Condition</label>
                          <select
                            id="condition"
                            name="condition"
                            value={resourceForm.condition}
                            onChange={handleResourceFormChange}
                          >
                            <option value="excellent">Excellent</option>
                            <option value="good">Good</option>
                            <option value="fair">Fair</option>
                            <option value="digital">Digital</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="form-section">
                      <h3>📍 Location Details</h3>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="college">College *</label>
                          <select
                            id="college"
                            name="college"
                            value={resourceForm.college}
                            onChange={handleResourceFormChange}
                            required
                          >
                            <option value="">Select College</option>
                            {COLLEGES.map((college) => (
                              <option key={college} value={college}>
                                {college}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group">
                          <label htmlFor="department">Department *</label>
                          <select
                            id="department"
                            name="department"
                            value={resourceForm.department}
                            onChange={handleResourceFormChange}
                            required
                          >
                            <option value="">Select Department</option>
                            {DEPARTMENTS.map((dept) => (
                              <option key={dept} value={dept}>
                                {dept}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="location">Specific Location</label>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={resourceForm.location}
                          onChange={handleResourceFormChange}
                          placeholder="e.g., Library 2nd Floor, Lab Block A"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="form-column">
                    <div className="form-section">
                      <h3>📅 Availability</h3>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="availableFrom">Available From *</label>
                          <input
                            type="date"
                            id="availableFrom"
                            name="availableFrom"
                            value={resourceForm.availableFrom}
                            onChange={handleResourceFormChange}
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="availableTo">Available Until (Optional)</label>
                          <input
                            type="date"
                            id="availableTo"
                            name="availableTo"
                            value={resourceForm.availableTo}
                            onChange={handleResourceFormChange}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="tags">Tags (comma separated)</label>
                        <input
                          type="text"
                          id="tags"
                          name="tags"
                          value={resourceForm.tags}
                          onChange={handleResourceFormChange}
                          placeholder="e.g., programming, algorithms, notes"
                        />
                      </div>
                    </div>

                    <div className="form-section">
                      <h3>📎 Upload File</h3>
                      
                      <div className="file-upload-area">
                        {!resourceFile ? (
                          <label className="file-drop-zone" htmlFor="file-input">
                            <div className="drop-zone-content">
                              <span className="upload-icon">📤</span>
                              <p>Click to upload or drag & drop</p>
                              <span className="file-types">PDF, DOC, DOCX, PPT, PPTX, MP4, JPG, PNG (max 50MB)</span>
                            </div>
                            <input
                              type="file"
                              id="file-input"
                              onChange={handleFileChange}
                              style={{ display: 'none' }}
                              accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.jpg,.jpeg,.png"
                            />
                          </label>
                        ) : (
                          <div className="file-preview">
                            {filePreview ? (
                              <img src={filePreview} alt="Preview" className="image-preview" />
                            ) : (
                              <div className="file-icon">📄</div>
                            )}
                            <div className="file-info">
                              <p className="file-name">{resourceFile.name}</p>
                              <p className="file-size">{(resourceFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                            <button type="button" className="remove-file-btn" onClick={removeFile}>
                              ✕
                            </button>
                          </div>
                        )}
                        
                        {uploading && (
                          <div className="upload-progress">
                            <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }}></div>
                            <span>{uploadProgress}%</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={resetResourceForm}
                        disabled={uploading}
                      >
                        Clear Form
                      </button>
                      <button
                        type="submit"
                        className="btn-primary"
                        disabled={uploading}
                      >
                        {uploading ? `Uploading... ${uploadProgress}%` : '📤 Add Resource'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="tab-content">
              <div className="resources-header">
                <h2>Manage Resources</h2>
                <button 
                  className="btn-primary quick-add-btn"
                  onClick={() => setActiveTab('add-resource')}
                >
                  ➕ Add New Resource
                </button>
              </div>
              <div className="resources-list">
                {resources.filter((r) => r.status !== 'pending').length === 0 ? (
                  <div className="empty-state">
                    <p>📚 No approved resources yet</p>
                    <button 
                      className="btn-primary"
                      onClick={() => setActiveTab('add-resource')}
                    >
                      Add Your First Resource
                    </button>
                  </div>
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
                          <span>📅 {new Date(resource.createdAt?.toDate?.() || resource.createdAt).toLocaleDateString()}</span>
                          <span>👁️ {resource.views || 0} views</span>
                          <span>📥 {resource.downloads || 0} downloads</span>
                        </div>
                        <div className="resource-actions">
                          {resource.fileUrl && (
                            <a 
                              href={resource.fileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="btn-small btn-secondary"
                            >
                              📥 Download
                            </a>
                          )}
                          <button className="btn-small btn-danger" onClick={() => handleReject(resource.id)}>
                            🗑️ Delete
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
