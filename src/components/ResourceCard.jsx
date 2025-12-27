import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useResourceStore } from '../store/resourceStore';
import { useToastStore } from '../store/toastStore';
import '../styles/resource-card.css';

const ResourceCard = ({ resource, onPreview }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { favorites, toggleFavorite } = useResourceStore();
  const { showSuccess, showError } = useToastStore();
  
  const isFavorited = favorites.includes(resource.id);
  const isMobile = window.innerWidth <= 768;

  const handleViewDetails = () => {
    // On mobile, directly open Google Drive link if available
    if (isMobile && resource.driveLink) {
      window.open(resource.driveLink, '_blank');
      return;
    }
    
    // Desktop behavior - show modal
    if (onPreview) {
      onPreview();
    } else {
      navigate(`/resource/${resource.id}`, { state: { resource } });
    }
  };

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    if (!user) {
      showError('Please login to bookmark resources');
      return;
    }

    try {
      await toggleFavorite(resource.id, user.uid);
      showSuccess(isFavorited ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      showError('Failed to update favorites');
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
        <button 
          className={`bookmark-btn ${isFavorited ? 'favorited' : ''}`} 
          onClick={handleToggleFavorite}
          title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <ion-icon name={isFavorited ? 'bookmark' : 'bookmark-outline'}></ion-icon>
        </button>
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
          {resource.views > 0 && (
            <div className="meta-item stats">
              <ion-icon name="eye-outline"></ion-icon>
              <span className="value">{resource.views}</span>
            </div>
          )}
          {resource.downloads > 0 && (
            <div className="meta-item stats">
              <ion-icon name="download-outline"></ion-icon>
              <span className="value">{resource.downloads}</span>
            </div>
          )}
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
