import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useResourceStore } from '../store/resourceStore';
import { ROUTES } from '../constants/routes';
import { CATEGORY_LABELS, RESOURCE_CATEGORIES } from '../constants/resources';
import { COLLEGES } from '../constants/colleges';
import { DEPARTMENTS } from '../constants/departments';
import '../styles/form.css';

const PostResource = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuthStore();
  const { createResource, loading, error } = useResourceStore();

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
    image: '',
    contactPreference: 'email',
    terms: '',
  });

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
    } else if (formData.description.length < 20) {
      newErrors.description = 'Please provide a more detailed description (min 20 characters)';
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

    try {
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
        userId: user.uid,
        userName: userProfile.fullName,
        userEmail: userProfile.email,
        status: 'available',
      };

      await createResource(resourceData);
      navigate(ROUTES.STUDENT_DASHBOARD);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    navigate(ROUTES.STUDENT_LOGIN);
    return null;
  }

  return (
    <div className="form-container">
      <div className="form-card form-card-wide">
        <div className="form-header">
          <button className="btn-back" onClick={() => navigate(ROUTES.STUDENT_DASHBOARD)}>
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
            <button type="submit" className="btn-primary btn-large" disabled={loading}>
              <ion-icon name="cloud-upload-outline"></ion-icon>
              {loading ? 'Posting Resource...' : 'Post Resource'}
            </button>
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => navigate(ROUTES.STUDENT_DASHBOARD)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostResource;
