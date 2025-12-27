import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useResourceStore } from '../store/resourceStore';
import { useToastStore } from '../store/toastStore';
import { uploadToDrive, getDriveUrls, extractDriveFileId, isValidDriveUrl } from '../services/driveService';
import {
  fetchAllUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getResourceAnalytics,
  getUserAnalytics,
  bulkApproveResources,
  bulkDeleteResources,
  toggleFeatureResource,
  createAnnouncement,
  fetchAnnouncements,
  deleteAnnouncement,
  getPlatformSettings,
  updatePlatformSettings,
  fetchReports,
  updateReportStatus,
  exportToCSV,
  prepareUsersExport,
  prepareResourcesExport,
  addCollege,
  removeCollege,
  addDepartment,
  removeDepartment,
} from '../services/adminService';
import { ROUTES } from '../constants/routes';
import { CATEGORY_LABELS, RESOURCE_CATEGORIES } from '../constants/resources';
import { COLLEGES } from '../constants/colleges';
import { DEPARTMENTS } from '../constants/departments';
import { YEARS } from '../constants/years';
import '../styles/admin-dashboard.css';

export default function AdminDashboard() {
  const { user, userProfile, logout } = useAuthStore();
  const { resources, fetchResources, createResource, updateResource, deleteResource } = useResourceStore();
  const { showSuccess, showError } = useToastStore();
  const navigate = useNavigate();
  
  // Tab State
  const [activeTab, setActiveTab] = useState('overview');
  
  // Users State
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userCollegeFilter, setUserCollegeFilter] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  
  // Resource Filters
  const [resourceCollegeFilter, setResourceCollegeFilter] = useState('');
  const [resourceDepartmentFilter, setResourceDepartmentFilter] = useState('');
  const [resourceYearFilter, setResourceYearFilter] = useState('');
  const [resourceCategoryFilter, setResourceCategoryFilter] = useState('');
  
  // Approval Filters
  const [approvalCollegeFilter, setApprovalCollegeFilter] = useState('');
  const [approvalDepartmentFilter, setApprovalDepartmentFilter] = useState('');
  const [approvalYearFilter, setApprovalYearFilter] = useState('');
  const [approvalCategoryFilter, setApprovalCategoryFilter] = useState('');
  
  // Bulk Selection State
  const [selectedResources, setSelectedResources] = useState([]);
  const [selectedPending, setSelectedPending] = useState([]);
  
  // Edit Resource State
  const [editingResource, setEditingResource] = useState(null);
  
  // Announcements State
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', message: '', type: 'info' });
  
  // Settings State
  const [platformSettings, setPlatformSettings] = useState({
    allowRegistrations: true,
    allowResourcePosting: true,
    autoApproveResources: false,
    maxFileSize: 50,
    enableNotifications: true,
    maintenanceMode: false,
  });
  
  // Reports State
  const [reports, setReports] = useState([]);
  
  // Colleges/Departments Management
  const [collegesList, setCollegesList] = useState([...COLLEGES]);
  const [departmentsList, setDepartmentsList] = useState([...DEPARTMENTS]);
  const [newCollege, setNewCollege] = useState('');
  const [newDepartment, setNewDepartment] = useState('');

  // Add Resource Form State
  const [resourceForm, setResourceForm] = useState({
    title: '',
    description: '',
    category: 'books',
    college: '',
    department: '',
    availableFrom: new Date().toISOString().split('T')[0],
    availableTo: '',
    tags: '',
  });
  const [resourceFiles, setResourceFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentUploadIndex, setCurrentUploadIndex] = useState(0);

  // Auth Check
  useEffect(() => {
    if (!user || userProfile?.role !== 'admin') {
      navigate(ROUTES.ADMIN_LOGIN);
    }
  }, [user, userProfile, navigate]);

  // Fetch Resources
  useEffect(() => {
    if (user && userProfile?.role === 'admin') {
      fetchResources({});
    }
  }, [user, userProfile, fetchResources]);

  // Fetch Users
  useEffect(() => {
    const loadUsers = async () => {
      if (user && userProfile?.role === 'admin') {
        setUsersLoading(true);
        try {
          const allUsers = await fetchAllUsers();
          setUsers(allUsers);
        } catch (error) {
          console.error('Error loading users:', error);
        } finally {
          setUsersLoading(false);
        }
      }
    };
    loadUsers();
  }, [user, userProfile]);

  // Fetch Announcements
  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const data = await fetchAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        console.error('Error loading announcements:', error);
      }
    };
    loadAnnouncements();
  }, []);

  // Fetch Settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await getPlatformSettings();
        setPlatformSettings(settings);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);

  // Fetch Reports
  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchReports();
        setReports(data);
      } catch (error) {
        console.error('Error loading reports:', error);
      }
    };
    loadReports();
  }, []);

  // Analytics
  const resourceAnalytics = useMemo(() => getResourceAnalytics(resources), [resources]);
  const userAnalytics = useMemo(() => getUserAnalytics(users), [users]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = !userSearchTerm || 
        u.fullName?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(userSearchTerm.toLowerCase());
      const matchesCollege = !userCollegeFilter || u.college === userCollegeFilter;
      const matchesRole = !userRoleFilter || u.role === userRoleFilter;
      return matchesSearch && matchesCollege && matchesRole;
    });
  }, [users, userSearchTerm, userCollegeFilter, userRoleFilter]);

  // Filtered Resources (for Resources Tab)
  const filteredResources = useMemo(() => {
    return resources.filter(r => {
      if (r.status === 'pending') return false; // Exclude pending
      const matchesCollege = !resourceCollegeFilter || r.college === resourceCollegeFilter;
      const matchesDepartment = !resourceDepartmentFilter || r.department === resourceDepartmentFilter;
      const matchesYear = !resourceYearFilter || r.year === resourceYearFilter;
      const matchesCategory = !resourceCategoryFilter || r.category === resourceCategoryFilter;
      return matchesCollege && matchesDepartment && matchesYear && matchesCategory;
    });
  }, [resources, resourceCollegeFilter, resourceDepartmentFilter, resourceYearFilter, resourceCategoryFilter]);

  // Filtered Pending Resources (for Approvals Tab)
  const filteredPendingResources = useMemo(() => {
    return resources.filter(r => {
      if (r.status !== 'pending') return false; // Only pending
      const matchesCollege = !approvalCollegeFilter || r.college === approvalCollegeFilter;
      const matchesDepartment = !approvalDepartmentFilter || r.department === approvalDepartmentFilter;
      const matchesYear = !approvalYearFilter || r.year === approvalYearFilter;
      const matchesCategory = !approvalCategoryFilter || r.category === approvalCategoryFilter;
      return matchesCollege && matchesDepartment && matchesYear && matchesCategory;
    });
  }, [resources, approvalCollegeFilter, approvalDepartmentFilter, approvalYearFilter, approvalCategoryFilter]);

  // Handlers
  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  const handleApprove = async (resourceId) => {
    try {
      await updateResource(resourceId, { status: 'available' });
      showSuccess('Resource approved successfully!');
    } catch (error) {
      showError('Failed to approve resource');
    }
  };

  const handleReject = async (resourceId) => {
    try {
      await deleteResource(resourceId);
      showSuccess('Resource rejected and deleted');
    } catch (error) {
      showError('Failed to reject resource');
    }
  };

  // Bulk Actions
  const handleBulkApprove = async () => {
    if (selectedPending.length === 0) return;
    try {
      await bulkApproveResources(selectedPending);
      showSuccess(`${selectedPending.length} resources approved!`);
      setSelectedPending([]);
      fetchResources({});
    } catch (error) {
      showError('Failed to bulk approve');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedResources.length === 0) return;
    if (!confirm(`Delete ${selectedResources.length} resources?`)) return;
    try {
      await bulkDeleteResources(selectedResources);
      showSuccess(`${selectedResources.length} resources deleted!`);
      setSelectedResources([]);
      fetchResources({});
    } catch (error) {
      showError('Failed to bulk delete');
    }
  };

  const handleToggleFeature = async (resourceId, currentFeatured) => {
    try {
      await toggleFeatureResource(resourceId, !currentFeatured);
      showSuccess(currentFeatured ? 'Resource unfeatured' : 'Resource featured!');
      fetchResources({});
    } catch (error) {
      showError('Failed to update feature status');
    }
  };

  // User Management
  const handlePromoteUser = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'student' : 'admin';
    if (!confirm(`Change user role to ${newRole}?`)) return;
    try {
      await updateUserRole(userId, newRole);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      showSuccess(`User role changed to ${newRole}`);
    } catch (error) {
      showError('Failed to update role');
    }
  };

  const handleBanUser = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'banned' ? 'active' : 'banned';
    try {
      await updateUserStatus(userId, newStatus);
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      showSuccess(newStatus === 'banned' ? 'User banned' : 'User unbanned');
    } catch (error) {
      showError('Failed to update status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      showSuccess('User deleted');
    } catch (error) {
      showError('Failed to delete user');
    }
  };

  // Announcements
  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.message) {
      showError('Please fill in all fields');
      return;
    }
    try {
      await createAnnouncement({
        ...newAnnouncement,
        createdBy: userProfile?.fullName || 'Admin',
      });
      const data = await fetchAnnouncements();
      setAnnouncements(data);
      setNewAnnouncement({ title: '', message: '', type: 'info' });
      showSuccess('Announcement created!');
    } catch (error) {
      showError('Failed to create announcement');
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      await deleteAnnouncement(id);
      setAnnouncements(announcements.filter(a => a.id !== id));
      showSuccess('Announcement deleted');
    } catch (error) {
      showError('Failed to delete announcement');
    }
  };

  // Settings
  const handleSaveSettings = async () => {
    try {
      await updatePlatformSettings(platformSettings);
      showSuccess('Settings saved!');
    } catch (error) {
      showError('Failed to save settings');
    }
  };

  // Reports
  const handleResolveReport = async (reportId) => {
    try {
      await updateReportStatus(reportId, 'resolved');
      setReports(reports.map(r => r.id === reportId ? { ...r, status: 'resolved' } : r));
      showSuccess('Report resolved');
    } catch (error) {
      showError('Failed to resolve report');
    }
  };

  // Export
  const handleExportUsers = () => {
    const data = prepareUsersExport(users);
    exportToCSV(data, 'users_export');
    showSuccess('Users exported to CSV');
  };

  const handleExportResources = () => {
    const data = prepareResourcesExport(resources);
    exportToCSV(data, 'resources_export');
    showSuccess('Resources exported to CSV');
  };

  // Colleges/Departments
  const handleAddCollege = () => {
    if (!newCollege.trim()) return;
    if (collegesList.includes(newCollege)) {
      showError('College already exists');
      return;
    }
    setCollegesList([...collegesList, newCollege]);
    addCollege(newCollege);
    setNewCollege('');
    showSuccess('College added!');
  };

  const handleRemoveCollege = (college) => {
    setCollegesList(collegesList.filter(c => c !== college));
    showSuccess('College removed');
  };

  const handleAddDepartment = () => {
    if (!newDepartment.trim()) return;
    if (departmentsList.includes(newDepartment)) {
      showError('Department already exists');
      return;
    }
    setDepartmentsList([...departmentsList, newDepartment]);
    addDepartment(newDepartment);
    setNewDepartment('');
    showSuccess('Department added!');
  };

  const handleRemoveDepartment = (dept) => {
    setDepartmentsList(departmentsList.filter(d => d !== dept));
    showSuccess('Department removed');
  };

  // Add Resource Form
  const handleResourceFormChange = (e) => {
    const { name, value } = e.target;
    setResourceForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

    const maxSize = 50 * 1024 * 1024;
    const validFiles = [];
    const previews = [];

    selectedFiles.forEach((file) => {
      if (file.size > maxSize) {
        showError(`File "${file.name}" exceeds 50MB limit`);
        return;
      }
      validFiles.push(file);

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreviews(prev => {
            const newPreviews = [...prev];
            const index = validFiles.indexOf(file);
            newPreviews[resourceFiles.length + index] = reader.result;
            return newPreviews;
          });
        };
        reader.readAsDataURL(file);
      } else {
        previews.push(null);
      }
    });

    if (validFiles.length > 0) {
      setResourceFiles(prev => [...prev, ...validFiles]);
    }

    // Reset input to allow selecting same files again
    e.target.value = '';
  };

  const removeFile = (index) => {
    setResourceFiles(prev => prev.filter((_, i) => i !== index));
    setFilePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeAllFiles = () => {
    setResourceFiles([]);
    setFilePreviews([]);
    setUploadProgress(0);
    setCurrentUploadIndex(0);
  };

  const resetResourceForm = () => {
    setResourceForm({
      title: '',
      description: '',
      category: 'books',
      college: '',
      department: '',
      availableFrom: new Date().toISOString().split('T')[0],
      availableTo: '',
      tags: '',
    });
    setResourceFiles([]);
    setFilePreviews([]);
    setUploadProgress(0);
    setCurrentUploadIndex(0);
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    if (!resourceForm.title.trim() || !resourceForm.description.trim() || 
        !resourceForm.college || !resourceForm.department) {
      showError('Please fill in all required fields');
      return;
    }

    // Check if using manual link or file upload
    const hasManualLink = resourceForm.driveLink && isValidDriveUrl(resourceForm.driveLink);
    const hasFiles = resourceFiles.length > 0;

    if (!hasManualLink && !hasFiles) {
      showError('Please provide a Google Drive link or upload files');
      return;
    }

    try {
      setUploading(true);
      const uploadedFiles = [];
      let fileUrl = null;
      let fileName = null;

      // If manual Google Drive link provided
      if (hasManualLink) {
        const fileId = extractDriveFileId(resourceForm.driveLink);
        if (fileId) {
          const urls = getDriveUrls(fileId);
          fileUrl = urls.downloadUrl;
          uploadedFiles.push({
            fileId,
            url: urls.downloadUrl,
            viewUrl: urls.viewUrl,
            embedUrl: urls.embedUrl,
            fileName: resourceForm.title,
            originalName: resourceForm.title,
            source: 'google-drive-link',
          });
        }
      }

      // If files selected for upload (via Cloud Function)
      if (hasFiles && !hasManualLink) {
        for (let i = 0; i < resourceFiles.length; i++) {
          setCurrentUploadIndex(i);
          const file = resourceFiles[i];
          
          try {
            const uploadResult = await uploadToDrive(file, (progress) => {
              const overallProgress = Math.round(((i * 100) + progress) / resourceFiles.length);
              setUploadProgress(overallProgress);
            });
            
            uploadedFiles.push({
              fileId: uploadResult.fileId,
              url: uploadResult.downloadUrl,
              viewUrl: uploadResult.viewUrl,
              fileName: uploadResult.fileName,
              originalName: file.name,
              size: file.size,
              type: file.type,
              source: 'google-drive-upload',
            });
          } catch (uploadErr) {
            console.error(`Failed to upload ${file.name}:`, uploadErr);
            // Continue with other files
          }
        }

        if (uploadedFiles.length === 0) {
          throw new Error('All file uploads failed');
        }
      }

      // Use first file as primary
      if (uploadedFiles.length > 0) {
        fileUrl = uploadedFiles[0].url;
        fileName = uploadedFiles[0].fileName;
      }

      const resourceData = {
        ...resourceForm,
        fileUrl,
        fileName,
        files: uploadedFiles,
        tags: resourceForm.tags.split(',').map(t => t.trim()).filter(t => t),
        status: 'available',
        userName: userProfile?.fullName || 'Admin',
        userEmail: userProfile?.email || 'admin@gyanasetu.com',
        views: 0,
        downloads: 0,
        storageType: 'google-drive',
      };

      // Remove driveLink from stored data (it's now in files array)
      delete resourceData.driveLink;

      await createResource(resourceData, user.uid);
      showSuccess('Resource added successfully!');
      resetResourceForm();
      setActiveTab('resources');
    } catch (error) {
      console.error('Upload error:', error);
      showError(`Failed to add resource: ${error.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  // Edit Resource
  const handleEditResource = async (e) => {
    e.preventDefault();
    if (!editingResource) return;
    try {
      await updateResource(editingResource.id, {
        title: editingResource.title,
        description: editingResource.description,
        category: editingResource.category,
        college: editingResource.college,
        department: editingResource.department,
      });
      showSuccess('Resource updated!');
      setEditingResource(null);
      fetchResources({});
    } catch (error) {
      showError('Failed to update resource');
    }
  };

  // Stats for overview
  const stats = {
    totalResources: resourceAnalytics.approvedResources,
    pendingApprovals: resourceAnalytics.pendingResources,
    totalUsers: userAnalytics.totalUsers,
    totalViews: resourceAnalytics.totalViews,
    totalDownloads: resourceAnalytics.totalDownloads,
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="header-left">
          <h1>🔐 Admin Dashboard</h1>
          <p className="header-subtitle">Manage GyanaSetu Platform</p>
        </div>
        <div className="header-right">
          <div className="admin-profile">
            <span className="admin-email">{userProfile?.email || 'Admin'}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      <div className="admin-container">
        {/* Sidebar */}
        <div className="admin-sidebar">
          <nav className="admin-nav">
            <button className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              📊 Overview
            </button>
            <button className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
              📈 Analytics
            </button>
            <button className={`nav-item ${activeTab === 'add-resource' ? 'active' : ''}`} onClick={() => setActiveTab('add-resource')}>
              ➕ Add Resource
            </button>
            <button className={`nav-item ${activeTab === 'resources' ? 'active' : ''}`} onClick={() => setActiveTab('resources')}>
              📚 Resources
            </button>
            <button className={`nav-item ${activeTab === 'approvals' ? 'active' : ''}`} onClick={() => setActiveTab('approvals')}>
              ✅ Approvals {stats.pendingApprovals > 0 && <span className="nav-badge">{stats.pendingApprovals}</span>}
            </button>
            <button className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
              👥 Users
            </button>
            <button className={`nav-item ${activeTab === 'announcements' ? 'active' : ''}`} onClick={() => setActiveTab('announcements')}>
              🔔 Announcements
            </button>
            <button className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
              🚨 Reports {reports.filter(r => r.status === 'pending').length > 0 && 
                <span className="nav-badge danger">{reports.filter(r => r.status === 'pending').length}</span>}
            </button>
            <button className={`nav-item ${activeTab === 'colleges' ? 'active' : ''}`} onClick={() => setActiveTab('colleges')}>
              🏫 Colleges/Depts
            </button>
            <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
              ⚙️ Settings
            </button>
            <button className={`nav-item ${activeTab === 'export' ? 'active' : ''}`} onClick={() => setActiveTab('export')}>
              📥 Export Data
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="admin-content">
          
          {/* ==================== OVERVIEW TAB ==================== */}
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
                <div className="stat-card warning">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-info">
                    <h3>Pending</h3>
                    <p className="stat-value">{stats.pendingApprovals}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <h3>Total Users</h3>
                    <p className="stat-value">{stats.totalUsers}</p>
                  </div>
                </div>
                <div className="stat-card success">
                  <div className="stat-icon">👁️</div>
                  <div className="stat-info">
                    <h3>Total Views</h3>
                    <p className="stat-value">{stats.totalViews}</p>
                  </div>
                </div>
                <div className="stat-card info">
                  <div className="stat-icon">📥</div>
                  <div className="stat-info">
                    <h3>Downloads</h3>
                    <p className="stat-value">{stats.totalDownloads}</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="actions-grid">
                  <button className="action-btn" onClick={() => setActiveTab('add-resource')}>
                    ➕ Add Resource
                  </button>
                  <button className="action-btn" onClick={() => setActiveTab('approvals')}>
                    ✅ Review Pending ({stats.pendingApprovals})
                  </button>
                  <button className="action-btn" onClick={() => setActiveTab('users')}>
                    👥 Manage Users
                  </button>
                  <button className="action-btn" onClick={() => setActiveTab('announcements')}>
                    🔔 Send Announcement
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="recent-section">
                <h3>📋 Recent Resources</h3>
                <div className="recent-list">
                  {resourceAnalytics.recentResources.map(r => (
                    <div key={r.id} className="recent-item">
                      <span className="recent-title">{r.title}</span>
                      <span className="recent-meta">{r.college} • {r.category}</span>
                      <span className={`recent-status status-${r.status}`}>{r.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== ANALYTICS TAB ==================== */}
          {activeTab === 'analytics' && (
            <div className="tab-content">
              <h2>📈 Analytics & Insights</h2>
              
              {/* Charts Section */}
              <div className="analytics-grid">
                {/* Category Performance */}
                <div className="analytics-card">
                  <h3>📊 Category Performance</h3>
                  <div className="bar-chart">
                    {Object.entries(resourceAnalytics.byCategory).map(([cat, data]) => (
                      <div key={cat} className="bar-item">
                        <span className="bar-label">{CATEGORY_LABELS[cat] || cat}</span>
                        <div className="bar-container">
                          <div 
                            className="bar-fill" 
                            style={{ width: `${Math.min((data.count / Math.max(resourceAnalytics.totalResources, 1)) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="bar-value">{data.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* College Distribution */}
                <div className="analytics-card">
                  <h3>🏫 College Distribution</h3>
                  <div className="bar-chart">
                    {Object.entries(resourceAnalytics.byCollege).map(([college, data]) => (
                      <div key={college} className="bar-item">
                        <span className="bar-label">{college}</span>
                        <div className="bar-container">
                          <div 
                            className="bar-fill college" 
                            style={{ width: `${Math.min((data.count / Math.max(resourceAnalytics.totalResources, 1)) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="bar-value">{data.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Downloaded */}
                <div className="analytics-card">
                  <h3>🔥 Most Downloaded</h3>
                  <div className="top-list">
                    {resourceAnalytics.topDownloaded.length === 0 ? (
                      <p className="empty-text">No downloads yet</p>
                    ) : (
                      resourceAnalytics.topDownloaded.map((r, i) => (
                        <div key={r.id} className="top-item">
                          <span className="top-rank">#{i + 1}</span>
                          <span className="top-title">{r.title}</span>
                          <span className="top-value">{r.downloads || 0} downloads</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Top Viewed */}
                <div className="analytics-card">
                  <h3>👁️ Most Viewed</h3>
                  <div className="top-list">
                    {resourceAnalytics.topViewed.length === 0 ? (
                      <p className="empty-text">No views yet</p>
                    ) : (
                      resourceAnalytics.topViewed.map((r, i) => (
                        <div key={r.id} className="top-item">
                          <span className="top-rank">#{i + 1}</span>
                          <span className="top-title">{r.title}</span>
                          <span className="top-value">{r.views || 0} views</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* User Stats */}
                <div className="analytics-card full-width">
                  <h3>👥 User Statistics</h3>
                  <div className="user-stats-grid">
                    <div className="user-stat">
                      <span className="user-stat-value">{userAnalytics.students}</span>
                      <span className="user-stat-label">Students</span>
                    </div>
                    <div className="user-stat">
                      <span className="user-stat-value">{userAnalytics.admins}</span>
                      <span className="user-stat-label">Admins</span>
                    </div>
                    <div className="user-stat">
                      <span className="user-stat-value">{userAnalytics.activeUsers}</span>
                      <span className="user-stat-label">Active</span>
                    </div>
                    <div className="user-stat danger">
                      <span className="user-stat-value">{userAnalytics.bannedUsers}</span>
                      <span className="user-stat-label">Banned</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== ADD RESOURCE TAB ==================== */}
          {activeTab === 'add-resource' && (
            <div className="tab-content">
              <div className="add-resource-header">
                <h2>➕ Add New Resource</h2>
                <p className="tab-description">Admin uploads are auto-approved.</p>
              </div>

              <form className="admin-resource-form" onSubmit={handleAddResource}>
                <div className="form-grid">
                  <div className="form-column">
                    <div className="form-section">
                      <h3>📝 Basic Information</h3>
                      <div className="form-group">
                        <label>Resource Title *</label>
                        <input
                          type="text"
                          name="title"
                          value={resourceForm.title}
                          onChange={handleResourceFormChange}
                          placeholder="e.g., Data Structures Notes"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Description *</label>
                        <textarea
                          name="description"
                          value={resourceForm.description}
                          onChange={handleResourceFormChange}
                          placeholder="Describe the resource..."
                          rows={4}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Category *</label>
                        <div className="category-input-wrapper">
                          <select
                            name="category"
                            value={RESOURCE_CATEGORIES.includes(resourceForm.category) ? resourceForm.category : 'custom'}
                            onChange={(e) => {
                              if (e.target.value === 'custom') {
                                setResourceForm(prev => ({ ...prev, category: '' }));
                              } else {
                                handleResourceFormChange(e);
                              }
                            }}
                          >
                            {RESOURCE_CATEGORIES.filter(c => c !== 'all').map((cat) => (
                              <option key={cat} value={cat}>{CATEGORY_LABELS[cat] || cat}</option>
                            ))}
                            <option value="custom">+ Add Custom Category</option>
                          </select>
                          {!RESOURCE_CATEGORIES.includes(resourceForm.category) && (
                            <input
                              type="text"
                              name="category"
                              value={resourceForm.category}
                              onChange={handleResourceFormChange}
                              placeholder="Enter custom category"
                              className="custom-category-input"
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="form-section">
                      <h3>📍 Location</h3>
                      <div className="form-row">
                        <div className="form-group">
                          <label>College *</label>
                          <select name="college" value={resourceForm.college} onChange={handleResourceFormChange} required>
                            <option value="">Select College</option>
                            {collegesList.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Department *</label>
                          <select name="department" value={resourceForm.department} onChange={handleResourceFormChange} required>
                            <option value="">Select Department</option>
                            {departmentsList.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-column">
                    <div className="form-section">
                      <h3>📅 Availability</h3>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Available From *</label>
                          <input type="date" name="availableFrom" value={resourceForm.availableFrom} onChange={handleResourceFormChange} required />
                        </div>
                        <div className="form-group">
                          <label>Until (Optional)</label>
                          <input type="date" name="availableTo" value={resourceForm.availableTo} onChange={handleResourceFormChange} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Tags (comma separated)</label>
                        <input type="text" name="tags" value={resourceForm.tags} onChange={handleResourceFormChange} placeholder="programming, notes" />
                      </div>
                    </div>

                    <div className="form-section">
                      <h3>📎 File Upload</h3>
                      
                      {/* Google Drive Link Option */}
                      <div className="form-group">
                        <label>🔗 Google Drive Link (Recommended)</label>
                        <input
                          type="url"
                          name="driveLink"
                          value={resourceForm.driveLink || ''}
                          onChange={handleResourceFormChange}
                          placeholder="Paste Google Drive file link here..."
                          className="drive-link-input"
                        />
                        <small className="form-hint">
                          💡 Upload file to Google Drive, make it public, and paste the link here
                        </small>
                      </div>

                      <div className="divider-text">
                        <span>OR</span>
                      </div>

                      <h4>📤 Upload from Computer</h4>
                      <div className="file-upload-area">
                        <label className="file-drop-zone" htmlFor="file-input">
                          <div className="drop-zone-content">
                            <span className="upload-icon">📤</span>
                            <p>Click to upload files</p>
                            <span className="file-types">PDF, DOC, PPT, MP4, Images (max 50MB each)</span>
                            <span className="file-hint">You can select multiple files</span>
                          </div>
                          <input 
                            type="file" 
                            id="file-input" 
                            onChange={handleFileChange} 
                            style={{ display: 'none' }} 
                            multiple
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.jpg,.jpeg,.png,.gif,.zip,.rar"
                          />
                        </label>
                        
                        {resourceFiles.length > 0 && (
                          <div className="files-list">
                            <div className="files-header">
                              <span className="files-count">{resourceFiles.length} file(s) selected</span>
                              <button type="button" className="btn-tiny btn-danger" onClick={removeAllFiles}>
                                Remove All
                              </button>
                            </div>
                            {resourceFiles.map((file, index) => (
                              <div key={index} className="file-preview">
                                {filePreviews[index] ? (
                                  <img src={filePreviews[index]} alt="Preview" className="image-preview" />
                                ) : (
                                  <div className="file-icon">
                                    {file.type.includes('pdf') ? '📕' : 
                                     file.type.includes('word') || file.type.includes('doc') ? '📘' :
                                     file.type.includes('presentation') || file.type.includes('ppt') ? '📙' :
                                     file.type.includes('video') ? '🎬' :
                                     file.type.includes('zip') || file.type.includes('rar') ? '📦' : '📄'}
                                  </div>
                                )}
                                <div className="file-info">
                                  <p className="file-name">{file.name}</p>
                                  <p className="file-size">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                </div>
                                <button type="button" className="remove-file-btn" onClick={() => removeFile(index)}>✕</button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {uploading && (
                          <div className="upload-progress-section">
                            <div className="upload-status">
                              <span>Uploading file {currentUploadIndex + 1} of {resourceFiles.length}</span>
                              <span className="upload-percent">{uploadProgress}%</span>
                            </div>
                            <div className="upload-progress">
                              <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="form-actions">
                      <button type="button" className="btn-secondary" onClick={resetResourceForm} disabled={uploading}>
                        Clear
                      </button>
                      <button type="submit" className="btn-primary" disabled={uploading}>
                        {uploading ? (
                          <>
                            <span className="btn-spinner"></span>
                            Uploading... ({currentUploadIndex + 1}/{resourceFiles.length})
                          </>
                        ) : (
                          `📤 Add Resource${resourceFiles.length > 0 ? ` (${resourceFiles.length} files)` : ''}`
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* ==================== RESOURCES TAB ==================== */}
          {activeTab === 'resources' && (
            <div className="tab-content">
              <div className="resources-header">
                <h2>📚 Manage Resources</h2>
                <div className="header-actions">
                  {selectedResources.length > 0 && (
                    <button className="btn-danger" onClick={handleBulkDelete}>
                      🗑️ Delete Selected ({selectedResources.length})
                    </button>
                  )}
                  <button className="btn-primary" onClick={() => setActiveTab('add-resource')}>➕ Add New</button>
                </div>
              </div>

              {/* Filters */}
              <div className="filters-bar" style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <select value={resourceCollegeFilter} onChange={e => setResourceCollegeFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd' }}>
                  <option value="">All Colleges</option>
                  {collegesList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={resourceDepartmentFilter} onChange={e => setResourceDepartmentFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd' }}>
                  <option value="">All Departments</option>
                  {departmentsList.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={resourceYearFilter} onChange={e => setResourceYearFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd' }}>
                  <option value="">All Years</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <select value={resourceCategoryFilter} onChange={e => setResourceCategoryFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd' }}>
                  <option value="">All Categories</option>
                  {RESOURCE_CATEGORIES.filter(c => c !== 'all').map(c => <option key={c} value={c}>{CATEGORY_LABELS[c] || c}</option>)}
                </select>
                {(resourceCollegeFilter || resourceDepartmentFilter || resourceYearFilter || resourceCategoryFilter) && (
                  <button onClick={() => {
                    setResourceCollegeFilter('');
                    setResourceDepartmentFilter('');
                    setResourceYearFilter('');
                    setResourceCategoryFilter('');
                  }} style={{ padding: '8px 12px', borderRadius: '6px', background: '#f3f4f6', border: 'none', cursor: 'pointer' }}>
                    Clear Filters
                  </button>
                )}
              </div>

              <div className="resources-list">
                {filteredResources.length === 0 ? (
                  <div className="empty-state">
                    <p>📚 No resources found</p>
                    <button className="btn-primary" onClick={() => setActiveTab('add-resource')}>Add First Resource</button>
                  </div>
                ) : (
                  filteredResources.map(resource => (
                    <div key={resource.id} className={`resource-item ${selectedResources.includes(resource.id) ? 'selected' : ''}`}>
                      <input
                        type="checkbox"
                        checked={selectedResources.includes(resource.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedResources([...selectedResources, resource.id]);
                          } else {
                            setSelectedResources(selectedResources.filter(id => id !== resource.id));
                          }
                        }}
                        className="resource-checkbox"
                      />
                      <div className="resource-content">
                        <div className="resource-header">
                          <h4>{resource.title}</h4>
                          <div className="resource-badges">
                            {resource.featured && <span className="badge featured">⭐ Featured</span>}
                            <span className="resource-category">{resource.category}</span>
                          </div>
                        </div>
                        <p className="resource-description">{resource.description}</p>
                        <div className="resource-meta">
                          <span>🏫 {resource.college}</span>
                          <span>👁️ {resource.views || 0}</span>
                          <span>📥 {resource.downloads || 0}</span>
                        </div>
                        <div className="resource-actions">
                          <button className="btn-small btn-secondary" onClick={() => setEditingResource(resource)}>✏️ Edit</button>
                          <button className="btn-small btn-warning" onClick={() => handleToggleFeature(resource.id, resource.featured)}>
                            {resource.featured ? '⭐ Unfeature' : '⭐ Feature'}
                          </button>
                          {resource.fileUrl && (
                            <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer" className="btn-small btn-info">📥 Download</a>
                          )}
                          <button className="btn-small btn-danger" onClick={() => handleReject(resource.id)}>🗑️ Delete</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Edit Modal */}
              {editingResource && (
                <div className="modal-overlay" onClick={() => setEditingResource(null)}>
                  <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <h3>✏️ Edit Resource</h3>
                    <form onSubmit={handleEditResource}>
                      <div className="form-group">
                        <label>Title</label>
                        <input
                          type="text"
                          value={editingResource.title}
                          onChange={e => setEditingResource({ ...editingResource, title: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea
                          value={editingResource.description}
                          onChange={e => setEditingResource({ ...editingResource, description: e.target.value })}
                          rows={4}
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Category</label>
                          <select
                            value={editingResource.category}
                            onChange={e => setEditingResource({ ...editingResource, category: e.target.value })}
                          >
                            {RESOURCE_CATEGORIES.filter(c => c !== 'all').map(cat => (
                              <option key={cat} value={cat}>{CATEGORY_LABELS[cat] || cat}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>College</label>
                          <select
                            value={editingResource.college}
                            onChange={e => setEditingResource({ ...editingResource, college: e.target.value })}
                          >
                            {collegesList.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={() => setEditingResource(null)}>Cancel</button>
                        <button type="submit" className="btn-primary">Save Changes</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== APPROVALS TAB ==================== */}
          {activeTab === 'approvals' && (
            <div className="tab-content">
              <div className="resources-header">
                <h2>✅ Pending Approvals</h2>
                {selectedPending.length > 0 && (
                  <button className="btn-success" onClick={handleBulkApprove}>
                    ✅ Approve Selected ({selectedPending.length})
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="filters-bar" style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <select value={approvalCollegeFilter} onChange={e => setApprovalCollegeFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd' }}>
                  <option value="">All Colleges</option>
                  {collegesList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={approvalDepartmentFilter} onChange={e => setApprovalDepartmentFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd' }}>
                  <option value="">All Departments</option>
                  {departmentsList.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={approvalYearFilter} onChange={e => setApprovalYearFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd' }}>
                  <option value="">All Years</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <select value={approvalCategoryFilter} onChange={e => setApprovalCategoryFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd' }}>
                  <option value="">All Categories</option>
                  {RESOURCE_CATEGORIES.filter(c => c !== 'all').map(c => <option key={c} value={c}>{CATEGORY_LABELS[c] || c}</option>)}
                </select>
                {(approvalCollegeFilter || approvalDepartmentFilter || approvalYearFilter || approvalCategoryFilter) && (
                  <button onClick={() => {
                    setApprovalCollegeFilter('');
                    setApprovalDepartmentFilter('');
                    setApprovalYearFilter('');
                    setApprovalCategoryFilter('');
                  }} style={{ padding: '8px 12px', borderRadius: '6px', background: '#f3f4f6', border: 'none', cursor: 'pointer' }}>
                    Clear Filters
                  </button>
                )}
              </div>

              <div className="resources-list">
                {filteredPendingResources.length === 0 ? (
                  <div className="empty-state">
                    <p>✨ No pending approvals found</p>
                  </div>
                ) : (
                  filteredPendingResources.map(resource => (
                    <div key={resource.id} className="resource-item pending-item">
                      <input
                        type="checkbox"
                        checked={selectedPending.includes(resource.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPending([...selectedPending, resource.id]);
                          } else {
                            setSelectedPending(selectedPending.filter(id => id !== resource.id));
                          }
                        }}
                        className="resource-checkbox"
                      />
                      <div className="resource-content">
                        <div className="resource-header">
                          <h4>{resource.title}</h4>
                          <span className="badge badge-warning">Pending</span>
                        </div>
                        <p className="resource-description">{resource.description}</p>
                        <div className="resource-details-grid">
                          <div className="detail-item"><strong>Category:</strong> {resource.category}</div>
                          <div className="detail-item"><strong>College:</strong> {resource.college}</div>
                          <div className="detail-item"><strong>By:</strong> {resource.userName}</div>
                          <div className="detail-item"><strong>Email:</strong> {resource.userEmail}</div>
                        </div>
                        <div className="resource-actions">
                          <button className="btn-small btn-success" onClick={() => handleApprove(resource.id)}>✅ Approve</button>
                          <button className="btn-small btn-danger" onClick={() => handleReject(resource.id)}>❌ Reject</button>
                          {resource.fileUrl && (
                            <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer" className="btn-small btn-secondary">📥 Preview</a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ==================== USERS TAB ==================== */}
          {activeTab === 'users' && (
            <div className="tab-content">
              <div className="resources-header">
                <h2>👥 User Management</h2>
                <button className="btn-secondary" onClick={handleExportUsers}>📥 Export Users</button>
              </div>

              {/* Filters */}
              <div className="filters-bar">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={userSearchTerm}
                  onChange={e => setUserSearchTerm(e.target.value)}
                  className="search-input"
                />
                <select value={userCollegeFilter} onChange={e => setUserCollegeFilter(e.target.value)}>
                  <option value="">All Colleges</option>
                  {collegesList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={userRoleFilter} onChange={e => setUserRoleFilter(e.target.value)}>
                  <option value="">All Roles</option>
                  <option value="student">Students</option>
                  <option value="admin">Admins</option>
                </select>
              </div>

              {/* Users List */}
              <div className="users-table">
                {usersLoading ? (
                  <div className="loading-state">Loading users...</div>
                ) : filteredUsers.length === 0 ? (
                  <div className="empty-state">No users found</div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>College</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(u => (
                        <tr key={u.id} className={u.status === 'banned' ? 'banned-row' : ''}>
                          <td>{u.fullName || 'N/A'}</td>
                          <td>{u.email}</td>
                          <td>{u.college || 'N/A'}</td>
                          <td>
                            <span className={`role-badge ${u.role}`}>{u.role}</span>
                          </td>
                          <td>
                            <span className={`status-badge ${u.status || 'active'}`}>
                              {u.status || 'active'}
                            </span>
                          </td>
                          <td className="action-cell">
                            <button 
                              className="btn-tiny btn-warning" 
                              onClick={() => handlePromoteUser(u.id, u.role)}
                              title={u.role === 'admin' ? 'Demote to Student' : 'Promote to Admin'}
                            >
                              {u.role === 'admin' ? '👤' : '👑'}
                            </button>
                            <button 
                              className={`btn-tiny ${u.status === 'banned' ? 'btn-success' : 'btn-danger'}`}
                              onClick={() => handleBanUser(u.id, u.status)}
                              title={u.status === 'banned' ? 'Unban' : 'Ban'}
                            >
                              {u.status === 'banned' ? '✓' : '🚫'}
                            </button>
                            <button 
                              className="btn-tiny btn-danger" 
                              onClick={() => handleDeleteUser(u.id)}
                              title="Delete User"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="user-stats-summary">
                <span>Total: {filteredUsers.length} users</span>
                <span>Students: {filteredUsers.filter(u => u.role === 'student').length}</span>
                <span>Admins: {filteredUsers.filter(u => u.role === 'admin').length}</span>
              </div>
            </div>
          )}

          {/* ==================== ANNOUNCEMENTS TAB ==================== */}
          {activeTab === 'announcements' && (
            <div className="tab-content">
              <h2>🔔 Announcements</h2>

              {/* Create Announcement */}
              <div className="announcement-form">
                <h3>Create New Announcement</h3>
                <form onSubmit={handleCreateAnnouncement}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Title *</label>
                      <input
                        type="text"
                        value={newAnnouncement.title}
                        onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                        placeholder="Announcement title"
                      />
                    </div>
                    <div className="form-group">
                      <label>Type</label>
                      <select
                        value={newAnnouncement.type}
                        onChange={e => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                      >
                        <option value="info">ℹ️ Info</option>
                        <option value="warning">⚠️ Warning</option>
                        <option value="success">✅ Success</option>
                        <option value="urgent">🚨 Urgent</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Message *</label>
                    <textarea
                      value={newAnnouncement.message}
                      onChange={e => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                      placeholder="Write your announcement..."
                      rows={4}
                    />
                  </div>
                  <button type="submit" className="btn-primary">📢 Publish Announcement</button>
                </form>
              </div>

              {/* Announcements List */}
              <div className="announcements-list">
                <h3>Previous Announcements</h3>
                {announcements.length === 0 ? (
                  <p className="empty-state">No announcements yet</p>
                ) : (
                  announcements.map(a => (
                    <div key={a.id} className={`announcement-item type-${a.type}`}>
                      <div className="announcement-header">
                        <h4>{a.title}</h4>
                        <span className={`announcement-type ${a.type}`}>{a.type}</span>
                      </div>
                      <p>{a.message}</p>
                      <div className="announcement-footer">
                        <span>By {a.createdBy}</span>
                        <button className="btn-tiny btn-danger" onClick={() => handleDeleteAnnouncement(a.id)}>Delete</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ==================== REPORTS TAB ==================== */}
          {activeTab === 'reports' && (
            <div className="tab-content">
              <h2>🚨 Content Reports</h2>

              <div className="reports-list">
                {reports.length === 0 ? (
                  <div className="empty-state">
                    <p>✨ No reports</p>
                  </div>
                ) : (
                  reports.map(report => (
                    <div key={report.id} className={`report-item status-${report.status}`}>
                      <div className="report-header">
                        <span className="report-resource">Resource ID: {report.resourceId}</span>
                        <span className={`report-status ${report.status}`}>{report.status}</span>
                      </div>
                      <p className="report-reason"><strong>Reason:</strong> {report.reason}</p>
                      <p className="report-details">{report.details}</p>
                      <div className="report-actions">
                        {report.status === 'pending' && (
                          <>
                            <button className="btn-small btn-success" onClick={() => handleResolveReport(report.id)}>
                              ✓ Resolve
                            </button>
                            <button className="btn-small btn-danger" onClick={() => handleReject(report.resourceId)}>
                              🗑️ Delete Resource
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ==================== COLLEGES TAB ==================== */}
          {activeTab === 'colleges' && (
            <div className="tab-content">
              <h2>🏫 Manage Colleges & Departments</h2>

              <div className="management-grid">
                {/* Colleges */}
                <div className="management-section">
                  <h3>Colleges</h3>
                  <div className="add-item-form">
                    <input
                      type="text"
                      value={newCollege}
                      onChange={e => setNewCollege(e.target.value)}
                      placeholder="New college name"
                    />
                    <button className="btn-primary" onClick={handleAddCollege}>Add</button>
                  </div>
                  <div className="items-list">
                    {collegesList.map(college => (
                      <div key={college} className="list-item">
                        <span>{college}</span>
                        <button className="btn-tiny btn-danger" onClick={() => handleRemoveCollege(college)}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Departments */}
                <div className="management-section">
                  <h3>Departments</h3>
                  <div className="add-item-form">
                    <input
                      type="text"
                      value={newDepartment}
                      onChange={e => setNewDepartment(e.target.value)}
                      placeholder="New department name"
                    />
                    <button className="btn-primary" onClick={handleAddDepartment}>Add</button>
                  </div>
                  <div className="items-list">
                    {departmentsList.map(dept => (
                      <div key={dept} className="list-item">
                        <span>{dept}</span>
                        <button className="btn-tiny btn-danger" onClick={() => handleRemoveDepartment(dept)}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== SETTINGS TAB ==================== */}
          {activeTab === 'settings' && (
            <div className="tab-content">
              <h2>⚙️ Platform Settings</h2>

              <div className="settings-grid">
                <div className="setting-card">
                  <h3>🔐 Access Control</h3>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={platformSettings.allowRegistrations}
                      onChange={e => setPlatformSettings({ ...platformSettings, allowRegistrations: e.target.checked })}
                    />
                    <span>Allow new registrations</span>
                  </label>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={platformSettings.allowResourcePosting}
                      onChange={e => setPlatformSettings({ ...platformSettings, allowResourcePosting: e.target.checked })}
                    />
                    <span>Allow resource posting</span>
                  </label>
                </div>

                <div className="setting-card">
                  <h3>📝 Moderation</h3>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={platformSettings.autoApproveResources}
                      onChange={e => setPlatformSettings({ ...platformSettings, autoApproveResources: e.target.checked })}
                    />
                    <span>Auto-approve resources</span>
                  </label>
                </div>

                <div className="setting-card">
                  <h3>📤 Upload Limits</h3>
                  <div className="setting-input">
                    <label>Max file size (MB)</label>
                    <input
                      type="number"
                      value={platformSettings.maxFileSize}
                      onChange={e => setPlatformSettings({ ...platformSettings, maxFileSize: parseInt(e.target.value) })}
                      min="1"
                      max="100"
                    />
                  </div>
                </div>

                <div className="setting-card">
                  <h3>🔔 Notifications</h3>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={platformSettings.enableNotifications}
                      onChange={e => setPlatformSettings({ ...platformSettings, enableNotifications: e.target.checked })}
                    />
                    <span>Enable email notifications</span>
                  </label>
                </div>

                <div className="setting-card danger">
                  <h3>⚠️ Maintenance</h3>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={platformSettings.maintenanceMode}
                      onChange={e => setPlatformSettings({ ...platformSettings, maintenanceMode: e.target.checked })}
                    />
                    <span>Maintenance mode</span>
                  </label>
                  <p className="setting-hint">When enabled, only admins can access the platform</p>
                </div>
              </div>

              <button className="btn-primary save-settings-btn" onClick={handleSaveSettings}>
                💾 Save All Settings
              </button>
            </div>
          )}

          {/* ==================== EXPORT TAB ==================== */}
          {activeTab === 'export' && (
            <div className="tab-content">
              <h2>📥 Export Data</h2>

              <div className="export-grid">
                <div className="export-card">
                  <div className="export-icon">👥</div>
                  <h3>Export Users</h3>
                  <p>Download all user data as CSV</p>
                  <p className="export-count">{users.length} users</p>
                  <button className="btn-primary" onClick={handleExportUsers}>📥 Download CSV</button>
                </div>

                <div className="export-card">
                  <div className="export-icon">📚</div>
                  <h3>Export Resources</h3>
                  <p>Download all resources data as CSV</p>
                  <p className="export-count">{resources.length} resources</p>
                  <button className="btn-primary" onClick={handleExportResources}>📥 Download CSV</button>
                </div>

                <div className="export-card">
                  <div className="export-icon">📊</div>
                  <h3>Generate Report</h3>
                  <p>Platform usage analytics report</p>
                  <button className="btn-secondary" onClick={() => {
                    const report = {
                      generatedAt: new Date().toISOString(),
                      totalUsers: userAnalytics.totalUsers,
                      totalResources: resourceAnalytics.totalResources,
                      totalViews: resourceAnalytics.totalViews,
                      totalDownloads: resourceAnalytics.totalDownloads,
                      byCategory: resourceAnalytics.byCategory,
                      byCollege: resourceAnalytics.byCollege,
                    };
                    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `analytics_report_${new Date().toISOString().split('T')[0]}.json`;
                    link.click();
                    showSuccess('Report downloaded!');
                  }}>📊 Generate Report</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
