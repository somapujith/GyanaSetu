import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useResourceStore } from '../store/resourceStore';
import { ROUTES } from '../constants/routes';
import '../styles/resource-detail.css';
import '../styles/student-dashboard.css';

const ResourceDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const resource = location.state?.resource;
  const { user, userProfile, logout } = useAuthStore();
  const { requestResource, loading, favorites, incrementViews, incrementDownloads } = useResourceStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');

  // Track view when component mounts
  useEffect(() => {
    if (resource?.id) {
      incrementViews(resource.id);
    }
  }, [resource?.id, incrementViews]);

  // Navigation functions
  const handleGoHome = () => navigate(ROUTES.HOME);
  const handleGoToDashboard = () => navigate(ROUTES.STUDENT_DASHBOARD);
  const handleGoToBrowse = () => navigate(ROUTES.BROWSE_RESOURCES);
  const handleGoToFavorites = () => navigate(ROUTES.MY_FAVORITES);
  const handleGoToRequests = () => navigate(ROUTES.MY_REQUESTS);
  const handleGoToProfile = () => navigate(ROUTES.PROFILE);
  const handleGoToPost = () => navigate(ROUTES.POST_RESOURCE);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  if (!resource) {
    return (
      <div className="detail-container">
        <p>Resource not found</p>
        <button onClick={() => navigate(-1)}>Go back</button>
      </div>
    );
  }

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate(ROUTES.HOME);
      return;
    }

    try {
      await requestResource(resource.id, user.uid, requestMessage);
      alert('Request sent successfully!');
      setRequestMessage('');
      setShowRequestForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  const isOwner = user?.uid === resource.userId;

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
          <button className="nav-link" onClick={handleGoToPost}>
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

    <div className="detail-container">
      <button className="btn-back" onClick={() => navigate(-1)}>
        ← Back to Resources
      </button>

      <div className="detail-content">
        <div className="detail-image">
          {resource.image ? (
            <img src={resource.image} alt={resource.title} />
          ) : (
            <div className="placeholder-large">
              <span>{resource.category}</span>
            </div>
          )}
        </div>

        <div className="detail-info">
          <div className="detail-header">
            <h1>{resource.title}</h1>
            <span className="category-tag">{resource.category}</span>
            <span className={`status-badge ${resource.status}`}>{resource.status}</span>
          </div>

          <p className="description">{resource.description}</p>

          {/* File Preview Section */}
          {resource.files && resource.files.length > 0 && resource.files[0].embedUrl && (
            <div className="file-preview-section">
              <h3 className="preview-title">📄 File Preview</h3>
              <div className="file-preview-container">
                <iframe
                  src={resource.files[0].embedUrl}
                  className="file-preview-iframe"
                  allow="autoplay"
                  title="File Preview"
                ></iframe>
              </div>
              <div className="preview-actions">
                <a 
                  href={resource.files[0].viewUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-preview"
                >
                  <ion-icon name="open-outline"></ion-icon>
                  Open in Google Drive
                </a>
                <a 
                  href={resource.files[0].downloadUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-download"
                  onClick={() => incrementDownloads(resource.id)}
                >
                  <ion-icon name="download-outline"></ion-icon>
                  Download
                </a>
              </div>
            </div>
          )}

          <div className="details-grid">
            <div className="detail-item">
              <span className="label">Owner</span>
              <span className="value">{resource.userName}</span>
            </div>
            <div className="detail-item">
              <span className="label">Email</span>
              <span className="value">{resource.userEmail}</span>
            </div>
            <div className="detail-item">
              <span className="label">College</span>
              <span className="value">{resource.college}</span>
            </div>
            <div className="detail-item">
              <span className="label">Location</span>
              <span className="value">{resource.location}</span>
            </div>
            <div className="detail-item">
              <span className="label">Condition</span>
              <span className="value">{resource.condition}</span>
            </div>
            <div className="detail-item">
              <span className="label">Available From</span>
              <span className="value">{resource.availableFrom}</span>
            </div>
            {resource.availableTo && (
              <div className="detail-item">
                <span className="label">Available Until</span>
                <span className="value">{resource.availableTo}</span>
              </div>
            )}
          </div>

          <div className="action-buttons">
            {isOwner ? (
              <>
                <button className="btn-secondary" onClick={() => navigate(`/edit-resource/${resource.id}`)}>
                  Edit Resource
                </button>
                <button className="btn-danger">Delete Resource</button>
              </>
            ) : (
              <>
                {showRequestForm ? (
                  <form onSubmit={handleRequest} className="request-form">
                    <textarea
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                      placeholder="Tell the owner why you need this resource..."
                      rows="4"
                      required
                    />
                    <div className="form-actions">
                      <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Request'}
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => setShowRequestForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    className="btn-primary"
                    onClick={() => {
                      if (!user) navigate(ROUTES.HOME);
                      else setShowRequestForm(true);
                    }}
                  >
                    Request Resource
                  </button>
                )}
              </>
            )}
          </div>

          {resource.requests && resource.requests.length > 0 && isOwner && (
            <div className="requests-section">
              <h3>Requests ({resource.requests.length})</h3>
              <div className="requests-list">
                {resource.requests.map((req, idx) => (
                  <div key={idx} className="request-item">
                    <p className="request-message">{req.message}</p>
                    <small className="request-date">{new Date(req.createdAt).toLocaleDateString()}</small>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};

export default ResourceDetail;
