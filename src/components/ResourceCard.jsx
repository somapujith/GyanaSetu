import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/resource-card.css';

const ResourceCard = ({ resource, onPreview }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    if (onPreview) {
      onPreview();
    } else {
      navigate(`/resource/${resource.id}`, { state: { resource } });
    }
  };

  const categoryEmojis = {
    books: '📚',
    lab: '🔬',
    tools: '🛠️',
    projects: '📋',
    notes: '📝',
    other: '📦',
  };

  const conditionLabels = {
    excellent: '🌟 Excellent',
    good: '✅ Good',
    fair: '📖 Fair',
  };

  return (
    <div className="resource-card">
      <div className="card-image">
        {resource.image ? (
          <img src={resource.image} alt={resource.title} />
        ) : (
          <div className="placeholder">
            <span>{categoryEmojis[resource.category] || '📦'}</span>
          </div>
        )}
        <span className="category-badge">{resource.category}</span>
        <span className={`status-indicator ${resource.status}`}>
          {resource.status === 'available' ? '●' : '○'}
        </span>
      </div>

      <div className="card-content">
        <h3>{resource.title}</h3>
        <p className="description">
          {resource.description?.length > 100 
            ? resource.description.substring(0, 100) + '...' 
            : resource.description}
        </p>

        <div className="card-meta">
          <div className="meta-item">
            <ion-icon name="person-outline"></ion-icon>
            <span className="value">{resource.userName}</span>
          </div>
          <div className="meta-item">
            <ion-icon name="school-outline"></ion-icon>
            <span className="value">{resource.college}</span>
          </div>
          <div className="meta-item">
            <ion-icon name="location-outline"></ion-icon>
            <span className="value">{resource.location}</span>
          </div>
        </div>

        <div className="card-footer">
          <span className="condition-badge">{conditionLabels[resource.condition] || resource.condition}</span>
          <button className="btn-get-resource" onClick={handleViewDetails}>
            <ion-icon name="hand-right-outline"></ion-icon>
            Get Resource
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
