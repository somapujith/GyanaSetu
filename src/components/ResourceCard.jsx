import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/resource-card.css';

const ResourceCard = ({ resource }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/resource/${resource.id}`, { state: { resource } });
  };

  const categoryEmojis = {
    books: '📚',
    lab: '🔬',
    tools: '🛠️',
    projects: '📋',
    other: '📦',
  };

  const conditionBadges = {
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
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
      </div>

      <div className="card-content">
        <h3>{resource.title}</h3>
        <p className="description">{resource.description.substring(0, 100)}...</p>

        <div className="card-meta">
          <div className="meta-item">
            <span className="label">By:</span>
            <span className="value">{resource.userName}</span>
          </div>
          <div className="meta-item">
            <span className="label">College:</span>
            <span className="value">{resource.college}</span>
          </div>
          <div className="meta-item">
            <span className="label">Location:</span>
            <span className="value">{resource.location}</span>
          </div>
        </div>

        <div className="card-footer">
          <span className="condition-badge">{conditionBadges[resource.condition]}</span>
          <button className="btn-primary-sm" onClick={handleViewDetails}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
