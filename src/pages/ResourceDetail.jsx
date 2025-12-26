import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useResourceStore } from '../store/resourceStore';
import '../styles/resource-detail.css';

const ResourceDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const resource = location.state?.resource;
  const { user, userProfile } = useAuthStore();
  const { requestResource, loading } = useResourceStore();

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');

  if (!resource) {
    return (
      <div className="detail-container">
        <p>Resource not found</p>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  const handleRequest = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
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
    <div className="detail-container">
      <button className="btn-back" onClick={() => navigate('/dashboard')}>
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
                      if (!user) navigate('/login');
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
  );
};

export default ResourceDetail;
