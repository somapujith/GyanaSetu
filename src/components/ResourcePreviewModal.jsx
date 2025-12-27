import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useResourceStore } from '../store/resourceStore';
import { ROUTES } from '../constants/routes';
import './ResourcePreviewModal.css';

const CATEGORY_ICONS = {
  books: '📚',
  lab: '🔬',
  tools: '🛠️',
  projects: '📋',
  notes: '📝',
  other: '📦',
};

export default function ResourcePreviewModal({ resource, onClose }) {
  const navigate = useNavigate();
  const { user, userProfile } = useAuthStore();
  const { incrementDownloads } = useResourceStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!resource) return null;

  const handleDownload = async () => {
    if (!user) {
      onClose();
      navigate(ROUTES.STUDENT_LOGIN);
      return;
    }

    // Track download
    if (resource.id) {
      await incrementDownloads(resource.id);
    }

    // Download the file directly
    if (resource.fileUrl || resource.image) {
      const link = document.createElement('a');
      link.href = resource.fileUrl || resource.image;
      link.download = resource.title || 'resource';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // If no file, open owner's email
      if (resource.userEmail) {
        window.location.href = `mailto:${resource.userEmail}?subject=Request for ${resource.title}`;
      }
    }
  };

  const isOwner = user?.uid === resource.userId;

  // Mobile View Component
  if (isMobile) {
    return (
      <div className="modal-overlay mobile-overlay" onClick={onClose}>
        <div className="preview-modal mobile-modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close mobile-close" onClick={onClose} aria-label="Close">
            <ion-icon name="close-outline" />
          </button>

          <div className="mobile-content">
            {/* Image Section */}
            <div className="mobile-image-section">
              {resource.image ? (
                <img src={resource.image} alt={resource.title} className="mobile-image" />
              ) : (
                <div className="mobile-placeholder">
                  <span className="placeholder-icon">{CATEGORY_ICONS[resource.category] || '📦'}</span>
                </div>
              )}
              <div className="mobile-badge">{resource.category}</div>
            </div>

            {/* Details Section */}
            <div className="mobile-details">
              <h2 className="mobile-title">{resource.title}</h2>
              <p className="mobile-owner">
                <ion-icon name="person-outline" />
                <strong>{resource.userName || 'Unknown'}</strong>
              </p>

              <div className="mobile-description">
                <h4>Description</h4>
                <p>{resource.description || 'No description provided.'}</p>
              </div>

              <div className="mobile-info-grid">
                <div className="mobile-info-item">
                  <span className="mobile-label">College</span>
                  <span className="mobile-value">{resource.college || 'N/A'}</span>
                </div>
                <div className="mobile-info-item">
                  <span className="mobile-label">Category</span>
                  <span className="mobile-value">{resource.category}</span>
                </div>
                <div className="mobile-info-item">
                  <span className="mobile-label">Department</span>
                  <span className="mobile-value">{resource.department || 'N/A'}</span>
                </div>
                <div className="mobile-info-item">
                  <span className="mobile-label">Year</span>
                  <span className="mobile-value">{resource.year || 'N/A'}</span>
                </div>
                <div className="mobile-info-item">
                  <span className="mobile-label">Status</span>
                  <span className={`mobile-status ${resource.status}`}>
                    {resource.status === 'available' ? '✅ Available' : '❌ Unavailable'}
                  </span>
                </div>
              </div>

              <div className="mobile-contact">
                <h4>Contact</h4>
                <p>
                  <ion-icon name="mail-outline" />
                  {resource.userEmail || 'Not available'}
                </p>
              </div>

              {/* Mobile Action Button */}
              <div className="mobile-actions">
                {isOwner ? (
                  <button className="mobile-btn mobile-btn-edit" onClick={() => { onClose(); navigate(`/edit-resource/${resource.id}`); }}>
                    <ion-icon name="create-outline" />
                    Edit Resource
                  </button>
                ) : (
                  <button className="mobile-btn mobile-btn-download" onClick={handleDownload}>
                    <ion-icon name="download-outline" />
                    Download Resource
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop View Component (Original)
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <ion-icon name="close-outline" />
        </button>

        <div className="preview-layout">
          {/* Left: Preview */}
          <div className="preview-left">
            <div className="preview-image-container">
              {resource.image ? (
                <img src={resource.image} alt={resource.title} className="preview-image" />
              ) : (
                <div className="preview-placeholder">
                  <span className="placeholder-icon">{CATEGORY_ICONS[resource.category] || '📦'}</span>
                  <span className="placeholder-text">{resource.category}</span>
                </div>
              )}
              <div className="preview-badge">{resource.category}</div>
            </div>

            {/* Quick Info Bar */}
            <div className="quick-info">
              <div className="info-chip">
                <ion-icon name="location-outline" />
                <span>{resource.location || 'Not specified'}</span>
              </div>
              <div className="info-chip">
                <ion-icon name="checkmark-circle-outline" />
                <span>{resource.condition || 'Good'}</span>
              </div>
              <div className={`status-chip ${resource.status}`}>
                {resource.status === 'available' ? 'Available' : 'Unavailable'}
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="preview-right">
            <div className="detail-header">
              <h2 className="resource-title">{resource.title}</h2>
              <p className="resource-owner">
                <ion-icon name="person-outline" />
                Shared by <strong>{resource.userName || 'Unknown'}</strong>
              </p>
            </div>

            <div className="detail-section">
              <h4>Description</h4>
              <p className="resource-description">{resource.description || 'No description provided.'}</p>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">College</span>
                <span className="detail-value">{resource.college || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Category</span>
                <span className="detail-value">{resource.category}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Available From</span>
                <span className="detail-value">{resource.availableFrom || 'Now'}</span>
              </div>
              {resource.availableTo && (
                <div className="detail-item">
                  <span className="detail-label">Until</span>
                  <span className="detail-value">{resource.availableTo}</span>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="contact-section">
              <h4>Contact</h4>
              <p className="contact-email">
                <ion-icon name="mail-outline" />
                {resource.userEmail || 'Not available'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="action-section">
              {isOwner ? (
                <div className="owner-actions">
                  <span className="owner-badge">You own this resource</span>
                  <button className="btn-edit" onClick={() => { onClose(); navigate(`/edit-resource/${resource.id}`); }}>
                    <ion-icon name="create-outline" />
                    Edit Resource
                  </button>
                </div>
              ) : (
                <div className="cta-buttons">
                  <button className="btn-download" onClick={handleDownload}>
                    <ion-icon name="download-outline" />
                    Download
                  </button>
                </div>
              )}
            </div>

            {/* Request Count */}
            {resource.requests && resource.requests.length > 0 && (
              <div className="requests-indicator">
                <ion-icon name="people-outline" />
                <span>{resource.requests.length} {resource.requests.length === 1 ? 'request' : 'requests'} pending</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
