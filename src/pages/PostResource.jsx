import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useResourceStore } from '../store/resourceStore';
import useToastStore from '../store/toastStore';
import { uploadResourceFile, formatFileSize, getFileType } from '../services/storage';
import { ROUTES } from '../constants/routes';
import { CATEGORY_LABELS, RESOURCE_CATEGORIES } from '../constants/resources';
import { COLLEGES } from '../constants/colleges';
import { DEPARTMENTS } from '../constants/departments';
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
    condition: 'good',
    college: '',
    department: '',
    location: '',
    availableFrom: '',
    availableTo: '',
    contactPreference: 'email',
    terms: '',
    tags: '',
  });

  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      showError('File size must be less than 50MB');
      return;
    }

    // Validate file type
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

    setFile(selectedFile);
    
    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
    setUploadProgress(0);
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
    } else if (formData.description.length < 20) {
      newErrors.description = 'Please provide a more detailed description (min 20 characters)';
    }

    // File validation
    if (!file) {
      newErrors.file = 'Please upload a resource file';
    }
    
    // College validation
    if (!formData.college) {
      newErrors.college = 'Please select your college';
    }
    
    // Location validation
    if (!formData.location.trim()) {
      newErrors.location = 'Pickup location is required';
    } else if (formData.location.length < 10) {
      newErrors.location = 'Please provide a more specific location';
    }
    
    // Date validation
    if (!formData.availableFrom) {
      newErrors.availableFrom = 'Start date is required';
    } else {
      const startDate = new Date(formData.availableFrom);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (startDate < today) {
        newErrors.availableFrom = 'Start date cannot be in the past';
      }
    }
    
    // End date validation (if provided)
    if (formData.availableTo) {
      const startDate = new Date(formData.availableFrom);
      const endDate = new Date(formData.availableTo);
      if (endDate <= startDate) {
        newErrors.availableTo = 'End date must be after start date';
      }
    }
    
    // Image URL validation (if provided)
    if (formData.image && !isValidUrl(formData.image)) {
      newErrors.image = 'Please enter a valid image URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
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
      // Upload file to Firebase Storage first
      const fileUrl = await uploadResourceFile(file, user.uid, (progress) => {
        setUploadProgress(progress);
      });
      
      const resourceData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        condition: formData.condition,
        college: formData.college,
        department: formData.department,
        location: formData.location.trim(),
        availableFrom: formData.availableFrom,
        availableTo: formData.availableTo || null,
        image: formData.image.trim() || null,
        contactPreference: formData.contactPreference,
        terms: formData.terms.trim() || null,
        fileUrl: fileUrl, // Add uploaded file URL
        fileName: file.name,
        fileSize: file.size,
        fileType: getFileType(file.name),
        userId: user.uid,
        userName: userProfile.fullName,
        userEmail: userProfile.email,
        status: 'available',
      };

      await createResource(resourceData);
      showSuccess('Resource posted successfully!');
      navigate(ROUTES.STUDENT_DASHBOARD);
    } catch (err) {
      console.error(err);
      showError(err.message || 'Failed to post resource. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
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

            {/* File Upload Section */}
            <div className="form-group">
              <label>Upload Resource File <span className="required">*</span></label>
              <div className="file-upload-area">
                {!file ? (
                  <label htmlFor="file-input" className="file-upload-label">
                    <ion-icon name="cloud-upload-outline"></ion-icon>
                    <p>Click to upload or drag and drop</p>
                    <span className="file-upload-hint">
                      PDF, DOC, DOCX, PPT, PPTX, MP4, JPG, PNG (max 50MB)
                    </span>
                  </label>
                ) : (
                  <div className="file-preview">
                    <div className="file-info">
                      {filePreview ? (
                        <img src={filePreview} alt="Preview" className="file-thumbnail" />
                      ) : (
                        <ion-icon name="document-outline" className="file-icon"></ion-icon>
                      )}
                      <div className="file-details">
                        <p className="file-name">{file.name}</p>
                        <p className="file-size">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button type="button" onClick={removeFile} className="remove-file-btn">
                      <ion-icon name="close-circle"></ion-icon>
                    </button>
                  </div>
                )}
                <input
                  id="file-input"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.jpg,.jpeg,.png"
                  style={{ display: 'none' }}
                />
              </div>
              {errors.file && <span className="error">{errors.file}</span>}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                  <span className="progress-text">{uploadProgress}%</span>
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category <span className="required">*</span></label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Condition</label>
                <select name="condition" value={formData.condition} onChange={handleChange}>
                  <option value="excellent">🌟 Excellent - Like new</option>
                  <option value="good">✅ Good - Minor wear</option>
                  <option value="fair">📖 Fair - Usable condition</option>
                </select>
              </div>
            </div>
          </div>

          {/* College & Location Section */}
          <div className="form-section">
            <h3 className="section-title">
              <ion-icon name="location-outline"></ion-icon>
              College & Location
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
              <label>Pickup Location <span className="required">*</span></label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., IIIT Hyderabad - Central Library, First Floor, Near Computers Section"
                className={errors.location ? 'input-error' : ''}
              />
              <span className="input-hint">Be specific so others can find you easily</span>
              {errors.location && <span className="error">{errors.location}</span>}
            </div>
          </div>

          {/* Availability Section */}
          <div className="form-section">
            <h3 className="section-title">
              <ion-icon name="calendar-outline"></ion-icon>
              Availability Period
            </h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Available From <span className="required">*</span></label>
                <input
                  type="date"
                  name="availableFrom"
                  value={formData.availableFrom}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={errors.availableFrom ? 'input-error' : ''}
                />
                {errors.availableFrom && <span className="error">{errors.availableFrom}</span>}
              </div>

              <div className="form-group">
                <label>Available Until <span className="optional">(Optional)</span></label>
                <input
                  type="date"
                  name="availableTo"
                  value={formData.availableTo}
                  onChange={handleChange}
                  min={formData.availableFrom || new Date().toISOString().split('T')[0]}
                />
                {errors.availableTo && <span className="error">{errors.availableTo}</span>}
              </div>
            </div>
          </div>

          {/* Additional Details Section */}
          <div className="form-section">
            <h3 className="section-title">
              <ion-icon name="settings-outline"></ion-icon>
              Additional Details
            </h3>

            <div className="form-group">
              <label>Image URL <span className="optional">(Optional)</span></label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className={errors.image ? 'input-error' : ''}
              />
              <span className="input-hint">Add a photo to help others identify the resource</span>
              {errors.image && <span className="error">{errors.image}</span>}
            </div>

            <div className="form-group">
              <label>Preferred Contact Method</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="contactPreference"
                    value="email"
                    checked={formData.contactPreference === 'email'}
                    onChange={handleChange}
                  />
                  <span>📧 Email</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="contactPreference"
                    value="chat"
                    checked={formData.contactPreference === 'chat'}
                    onChange={handleChange}
                  />
                  <span>💬 In-App Chat</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Lending Terms <span className="optional">(Optional)</span></label>
              <textarea
                name="terms"
                value={formData.terms}
                onChange={handleChange}
                placeholder="e.g., Maximum lending period: 2 weeks. Please return in same condition."
                rows="2"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary btn-large" disabled={uploading || loading}>
              <ion-icon name="cloud-upload-outline"></ion-icon>
              {uploading ? `Uploading... ${uploadProgress}%` : loading ? 'Posting Resource...' : 'Post Resource'}
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
