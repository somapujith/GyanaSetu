import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useResourceStore } from '../store/resourceStore';
import useToastStore from '../store/toastStore';
import { uploadResourceFile, formatFileSize, getFileType } from '../services/storage';
import { getDriveUrls, extractDriveFileId, isValidDriveUrl } from '../services/driveService';
import { ROUTES } from '../constants/routes';
import { CATEGORY_LABELS, RESOURCE_CATEGORIES } from '../constants/resources';
import { COLLEGES } from '../constants/colleges';
import { DEPARTMENTS } from '../constants/departments';
import { YEARS } from '../constants/years';
import Loading from '../components/Loading';
import '../styles/form.css';
import '../styles/student-dashboard.css';

const PostResource = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuthStore();
  const { createResource, loading, error, favorites } = useResourceStore();
  const { success: showSuccess, error: showError } = useToastStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation functions
  const handleGoHome = () => navigate(ROUTES.HOME);
  const handleGoToDashboard = () => navigate(ROUTES.STUDENT_DASHBOARD);
  const handleGoToBrowse = () => navigate(ROUTES.BROWSE_RESOURCES);
  const handleGoToFavorites = () => navigate(ROUTES.MY_FAVORITES);
  const handleGoToRequests = () => navigate(ROUTES.MY_REQUESTS);
  const handleGoToProfile = () => navigate(ROUTES.PROFILE);

  const handleLogout = async () => {
    const { logout } = useAuthStore.getState();
    await logout();
    navigate(ROUTES.HOME);
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'books',
    college: '',
    department: '',
    year: '',
    driveLink: '',
  });

  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [charCount, setCharCount] = useState({ title: 0, description: 0 });

  // Auto-fill college from user profile
  useEffect(() => {
    if (userProfile?.college) {
      setFormData(prev => ({ ...prev, college: userProfile.college }));
    }
  }, [userProfile]);

  const categories = RESOURCE_CATEGORIES.filter((c) => c !== 'all').map((value) => ({
    value,
    label: CATEGORY_LABELS[value] || value,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Update character count
    if (name === 'title' || name === 'description') {
      setCharCount(prev => ({ ...prev, [name]: value.length }));
    }
    
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };



  const validateForm = () => {
    const newErrors = {};
    
    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 5) {
      newErrors.description = 'Please provide a more detailed description (min 5 characters)';
    }

    // Google Drive link validation
    if (!formData.driveLink.trim()) {
      newErrors.driveLink = 'Google Drive link is required';
    } else if (!isValidDriveUrl(formData.driveLink)) {
      newErrors.driveLink = 'Please enter a valid Google Drive link';
    }
    
    // College validation
    if (!formData.college) {
      newErrors.college = 'Please select your college';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setUploading(true);
    
    try {
      // Extract Drive file ID and generate URLs
      const fileId = extractDriveFileId(formData.driveLink);
      const driveUrls = getDriveUrls(fileId);
      
      const resourceData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        college: formData.college,
        department: formData.department,
        year: formData.year || null,
        driveLink: formData.driveLink.trim(),
        fileUrl: driveUrls.viewUrl,
        downloadUrl: driveUrls.downloadUrl,
        embedUrl: driveUrls.embedUrl,
        userId: user.uid,
        userName: userProfile.fullName,
        userEmail: userProfile.email,
        status: 'pending',
      };

      await createResource(resourceData);
      showSuccess('Resource posted successfully and pending approval!');
      navigate(ROUTES.STUDENT_DASHBOARD);
    } catch (err) {
      console.error(err);
      showError(err.message || 'Failed to post resource. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    navigate(ROUTES.STUDENT_LOGIN);
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
          <button className="nav-link active" onClick={() => setMobileMenuOpen(false)}>
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

    <div className="form-container">
      <div className="form-card form-card-wide">
        <div className="form-header">
          <button className="btn-back" onClick={handleGoToDashboard}>
            <ion-icon name="arrow-back-outline"></ion-icon>
            Back to Dashboard
          </button>
          <h2>📤 Share a Resource</h2>
          <p className="form-subtitle">Help fellow students by sharing your academic resources</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <div className="form-section">
            <h3 className="section-title">
              <ion-icon name="information-circle-outline"></ion-icon>
              Basic Information
            </h3>
            
            <div className="form-group">
              <label>Resource Title <span className="required">*</span></label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Introduction to Algorithms - Thomas H. Cormen (3rd Edition)"
                className={errors.title ? 'input-error' : ''}
                maxLength={100}
              />
              <div className="input-footer">
                <span className={`char-count ${charCount.title > 80 ? 'warning' : ''}`}>
                  {charCount.title}/100
                </span>
                {errors.title && <span className="error">{errors.title}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Description <span className="required">*</span></label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the resource in detail:
• What is it about?
• What condition is it in?
• Any specific chapters/sections available?
• Any marks or highlights?"
                rows="5"
                className={errors.description ? 'input-error' : ''}
              />
              <div className="input-footer">
                <span className="char-count">{charCount.description} characters</span>
                {errors.description && <span className="error">{errors.description}</span>}
              </div>
            </div>

            {/* Google Drive Link Section */}
            <div className="form-group">
              <label>🔗 Google Drive Link <span className="required">*</span></label>
              <input
                type="url"
                name="driveLink"
                value={formData.driveLink}
                onChange={handleChange}
                placeholder="Paste Google Drive file link here (e.g., https://drive.google.com/file/d/...)"
                className={errors.driveLink ? 'input-error' : ''}
              />
              <span className="input-hint">
                💡 Upload your file to Google Drive, make it viewable to anyone with the link, and paste the link here
              </span>
              {errors.driveLink && <span className="error">{errors.driveLink}</span>}
            </div>

            <div className="form-group">
              <label>Category <span className="required">*</span></label>
              <div className="category-input-wrapper">
                <select
                  name="category"
                  value={RESOURCE_CATEGORIES.includes(formData.category) ? formData.category : 'custom'}
                  onChange={(e) => {
                    if (e.target.value === 'custom') {
                      setFormData(prev => ({ ...prev, category: '' }));
                    } else {
                      handleChange(e);
                    }
                  }}
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                  <option value="custom">+ Add Custom Category</option>
                </select>
                {!RESOURCE_CATEGORIES.includes(formData.category) && (
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Enter custom category"
                    className="custom-category-input"
                    style={{ marginTop: '8px' }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* College & Department Section */}
          <div className="form-section">
            <h3 className="section-title">
              <ion-icon name="school-outline"></ion-icon>
              College & Department
            </h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>College/Institution <span className="required">*</span></label>
                <select 
                  name="college" 
                  value={formData.college} 
                  onChange={handleChange}
                  className={errors.college ? 'input-error' : ''}
                >
                  <option value="">-- Select College --</option>
                  {COLLEGES.map((college) => (
                    <option key={college} value={college}>
                      {college}
                    </option>
                  ))}
                </select>
                {errors.college && <span className="error">{errors.college}</span>}
              </div>

              <div className="form-group">
                <label>Department</label>
                <select name="department" value={formData.department} onChange={handleChange}>
                  <option value="">-- Select Department --</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Year</label>
              <select name="year" value={formData.year} onChange={handleChange}>
                <option value="">-- Select Year --</option>
                {YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary btn-large" disabled={uploading || loading}>
              <ion-icon name="cloud-upload-outline"></ion-icon>
              {uploading ? 'Submitting...' : loading ? 'Posting Resource...' : 'Post Resource'}
            </button>
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={handleGoToDashboard}
              disabled={uploading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      {uploading && <Loading size="large" fullscreen />}
    </div>
  </div>
  );
};

export default PostResource;
