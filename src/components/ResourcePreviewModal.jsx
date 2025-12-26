import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { requestResource, loading, incrementDownloads } = useResourceStore();
  const [requestMessage, setRequestMessage] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

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

    // If resource has a downloadable file/link
    if (resource.fileUrl || resource.image) {
      const link = document.createElement('a');
      link.href = resource.fileUrl || resource.image;
      link.download = resource.title || 'resource';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Show request form for physical resources
      setShowRequestForm(true);
    }
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!user) {
      onClose();
      navigate(ROUTES.STUDENT_LOGIN);
      return;
    }

    try {
      await requestResource(resource.id, user.uid, requestMessage);
      setRequestSent(true);
      setRequestMessage('');
      setTimeout(() => {
        setShowRequestForm(false);
        setRequestSent(false);
      }, 2000);
    } catch (error) {
      console.error('Request error:', error);
    }
  };

  const isOwner = user?.uid === resource.userId;
  const isDigitalResource = resource.fileUrl || resource.category === 'notes' || resource.category === 'projects';

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
              ) : showRequestForm ? (
                <form onSubmit={handleRequest} className="request-form">
                  {requestSent ? (
                    <div className="success-message">
                      <ion-icon name="checkmark-circle" />
                      Request sent successfully!
                    </div>
                  ) : (
                    <>
                      <textarea
                        value={requestMessage}
                        onChange={(e) => setRequestMessage(e.target.value)}
                        placeholder="Tell the owner why you need this resource and when you can pick it up..."
                        rows="3"
                        required
                      />
                      <div className="form-buttons">
                        <button type="submit" className="btn-primary" disabled={loading}>
                          {loading ? 'Sending...' : 'Send Request'}
                        </button>
                        <button type="button" className="btn-secondary" onClick={() => setShowRequestForm(false)}>
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </form>
              ) : (
                <div className="cta-buttons">
                  <button className="btn-download" onClick={handleDownload}>
                    <ion-icon name={isDigitalResource ? 'download-outline' : 'hand-right-outline'} />
                    {isDigitalResource ? 'Download Resource' : 'Get Resource'}
                  </button>
                  {!isDigitalResource && (
                    <button className="btn-request" onClick={() => {
                      if (!user) {
                        onClose();
                        navigate(ROUTES.STUDENT_LOGIN);
                      } else {
                        setShowRequestForm(true);
                      }
                    }}>
                      <ion-icon name="chatbubble-outline" />
                      Send Request
                    </button>
                  )}
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
