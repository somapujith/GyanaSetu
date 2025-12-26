import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useResourceStore } from '../store/resourceStore';
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
    location: '',
    availableFrom: '',
    availableTo: '',
    image: '',
  });

  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'books', label: 'Books & Notes' },
    { value: 'lab', label: 'Lab Equipment' },
    { value: 'tools', label: 'Study Tools' },
    { value: 'projects', label: 'Projects & Materials' },
    { value: 'other', label: 'Other' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.availableFrom) newErrors.availableFrom = 'Start date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const resourceData = {
        ...formData,
        userId: user.uid,
        userName: userProfile.fullName,
        userEmail: userProfile.email,
        college: userProfile.college,
        status: 'available',
      };

      await createResource(resourceData);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            ← Back
          </button>
          <h2>Post a Resource</h2>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Resource Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Data Structures - Thomas H. Cormen"
            />
            {errors.title && <span className="error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the resource, condition, and lending terms..."
              rows="4"
            />
            {errors.description && <span className="error">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
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
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Location / Pickup Point *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., IIIT Hyderabad - Library, First Floor"
            />
            {errors.location && <span className="error">{errors.location}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Available From *</label>
              <input
                type="date"
                name="availableFrom"
                value={formData.availableFrom}
                onChange={handleChange}
              />
              {errors.availableFrom && <span className="error">{errors.availableFrom}</span>}
            </div>

            <div className="form-group">
              <label>Available Until</label>
              <input
                type="date"
                name="availableTo"
                value={formData.availableTo}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Posting...' : 'Post Resource'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostResource;
