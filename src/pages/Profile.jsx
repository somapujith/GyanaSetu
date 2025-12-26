import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { useResourceStore } from '../store/resourceStore';
import { uploadProfilePhoto } from '../services/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ROUTES } from '../constants/routes';
import Loading from '../components/Loading';
import './Profile.css';
import '../styles/student-dashboard.css';

export default function Profile() {
  const navigate = useNavigate();
  const { user, userProfile, fetchUserProfile, logout } = useAuthStore();
  const { showSuccess, showError } = useToastStore();
  const { favorites } = useResourceStore();
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    photo: null,
    photoPreview: null,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation functions
  const handleGoHome = () => navigate(ROUTES.HOME);
  const handleGoToDashboard = () => navigate(ROUTES.STUDENT_DASHBOARD);
  const handleGoToBrowse = () => navigate(ROUTES.BROWSE_RESOURCES);
  const handleGoToFavorites = () => navigate(ROUTES.MY_FAVORITES);
  const handleGoToRequests = () => navigate(ROUTES.MY_REQUESTS);
  const handleGoToPost = () => navigate(ROUTES.POST_RESOURCE);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  // Load user profile data
  useEffect(() => {
    if (userProfile) {
      setProfile({
        fullName: userProfile.fullName || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        location: userProfile.location || '',
        bio: userProfile.bio || '',
        photo: null,
        photoPreview: userProfile.photoURL || null,
      });
    }
  }, [userProfile]);

  const handleChange = e => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('Image size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('Please upload an image file');
      return;
    }

    setUploading(true);
    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64String = reader.result;
          
          // Update Firestore with base64 image
          await updateDoc(doc(db, 'users', user.uid), {
            photoURL: base64String,
          });

          // Update local state
          setProfile(prev => ({ 
            ...prev, 
            photo: file, 
            photoPreview: base64String 
          }));

          // Refresh user profile
          await fetchUserProfile(user.uid);
          
          showSuccess('Profile photo updated successfully!');
          setUploading(false);
        } catch (error) {
          console.error('Error uploading photo:', error);
          showError('Failed to upload photo. Please try again.');
          setUploading(false);
        }
      };
      
      reader.onerror = () => {
        showError('Failed to read image file');
        setUploading(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading photo:', error);
      showError('Failed to upload photo. Please try again.');
      setUploading(false);
    }
  };

  const handleEditSection = section => setEditingSection(section);
  const handleCancelEdit = () => setEditingSection(null);
  
  const handleSaveSection = async () => {
    setSaving(true);
    try {
      // Update Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        fullName: profile.fullName,
        phone: profile.phone,
        location: profile.location,
        bio: profile.bio,
      });

      // Refresh user profile
      await fetchUserProfile(user.uid);
      
      setEditingSection(null);
      showSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      showError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Calculate profile completion dynamically
  const completionData = useMemo(() => {
    const items = [
      { 
        label: 'Setup account', 
        percentage: 10, 
        completed: !!user && !!userProfile 
      },
      { 
        label: 'Upload your photo', 
        percentage: 5, 
        completed: !!profile.photoPreview 
      },
      { 
        label: 'Personal Info', 
        percentage: 10, 
        completed: !!profile.fullName && !!profile.email 
      },
      { 
        label: 'Location', 
        percentage: 20, 
        completed: !!profile.location && profile.location.trim().length > 0 
      },
      { 
        label: 'Biography', 
        percentage: 15, 
        completed: !!profile.bio && profile.bio.trim().length > 0 
      },
      { 
        label: 'Phone', 
        percentage: 10, 
        completed: !!profile.phone && profile.phone.trim().length > 0 
      },
    ];

    const totalPercentage = items.reduce((sum, item) => 
      sum + (item.completed ? item.percentage : 0), 0
    );

    return { items, totalPercentage };
  }, [user, userProfile, profile]);

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
          <button className="nav-icon-btn active" onClick={() => setMobileMenuOpen(false)} title="Profile">
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

      <div className="profile-container">
        <aside className="profile-sidebar">
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <span className="logo-icon">📚</span>
              <span className="logo-text">GyanaSetu</span>
            </div>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-label">Profile</div>
            <button className="sidebar-item active" onClick={() => navigate(ROUTES.PROFILE)}>
              <ion-icon name="person-outline"></ion-icon>
              <span>Edit Profile</span>
            </button>
            <button className="sidebar-item" onClick={() => navigate('/profile/notifications')}>
              <ion-icon name="notifications-outline"></ion-icon>
              <span>Notifications</span>
            </button>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-label">Secure</div>
            <button className="sidebar-item" onClick={() => navigate('/profile/password')}>
              <ion-icon name="lock-closed-outline"></ion-icon>
              <span>Password</span>
            </button>
          <button className="sidebar-item" onClick={() => navigate('/profile/access')}>
            <ion-icon name="shield-checkmark-outline"></ion-icon>
            <span>Access</span>
          </button>
        </div>
        <button className="sidebar-delete" onClick={() => navigate(ROUTES.HOME)}>
          <ion-icon name="arrow-back-outline"></ion-icon>
          <span>Back to Home</span>
        </button>
      </aside>

      <main className="profile-main">
        <header className="profile-header">
          <input type="search" placeholder="Search" className="profile-search" />
          <div className="profile-header-actions">
            <button className="header-icon-btn">
              <ion-icon name="help-circle-outline"></ion-icon>
            </button>
            <button className="header-icon-btn">
              <ion-icon name="notifications-outline"></ion-icon>
              <span className="notification-badge">2</span>
            </button>
            <button className="header-avatar" onClick={() => navigate(ROUTES.STUDENT_DASHBOARD)}>
              <img src={profile.photoPreview || "https://via.placeholder.com/40"} alt="User" />
            </button>
          </div>
        </header>

        <div className="profile-content">
          <h1 className="profile-title">Edit Profile</h1>

          <div className="profile-layout">
            <div className="profile-sections">
              {/* Photo Upload Section */}
              <section className="profile-card photo-card">
                <label htmlFor="photo-upload" className="photo-upload-area">
                  {uploading ? (
                    <Loading size="large" />
                  ) : profile.photoPreview ? (
                    <img src={profile.photoPreview} alt="Profile" className="profile-photo-large" />
                  ) : (
                    <div className="profile-photo-placeholder-large">
                      <ion-icon name="person-outline"></ion-icon>
                    </div>
                  )}
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handlePhotoChange}
                    disabled={uploading}
                  />
                </label>
                <div className="photo-info">
                  <h3>Upload new photo</h3>
                  <p>At least 800×800 px recommended.<br />JPG or PNG is allowed (max 5MB)</p>
                </div>
              </section>

              {/* Personal Info Section */}
              <section className="profile-card">
                <div className="card-header">
                  <h3>Personal Info</h3>
                  {editingSection !== 'personal' && (
                    <button className="edit-link" onClick={() => handleEditSection('personal')}>
                      <ion-icon name="create-outline"></ion-icon> Edit
                    </button>
                  )}
                </div>
                <div className="card-content">
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Full Name</label>
                      {editingSection === 'personal' ? (
                        <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} />
                      ) : (
                        <div className="info-value">{profile.fullName}</div>
                      )}
                    </div>
                    <div className="info-item">
                      <label>Email</label>
                      {editingSection === 'personal' ? (
                        <input type="email" name="email" value={profile.email} onChange={handleChange} />
                      ) : (
                        <div className="info-value">{profile.email}</div>
                      )}
                    </div>
                    <div className="info-item">
                      <label>Phone</label>
                      {editingSection === 'personal' ? (
                        <input type="tel" name="phone" value={profile.phone} onChange={handleChange} />
                      ) : (
                        <div className="info-value">{profile.phone}</div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Location Section */}
              <section className="profile-card">
                <div className="card-header">
                  <h3>Location</h3>
                  {editingSection !== 'location' && (
                    <button className="edit-link" onClick={() => handleEditSection('location')}>
                      <ion-icon name="create-outline"></ion-icon> Edit
                    </button>
                  )}
                </div>
                <div className="card-content">
                  {editingSection === 'location' ? (
                    <div className="location-edit">
                      <input type="text" name="location" value={profile.location} onChange={handleChange} className="location-input" />
                      <div className="edit-actions">
                        <button className="btn-cancel" onClick={handleCancelEdit}>Cancel</button>
                        <button className="btn-save" onClick={handleSaveSection}>Save changes</button>
                      </div>
                    </div>
                  ) : (
                    <div className="info-value">{profile.location}</div>
                  )}
                </div>
              </section>

              {/* Bio Section */}
              <section className="profile-card">
                <div className="card-header">
                  <h3>Bio</h3>
                  {editingSection !== 'bio' && (
                    <button className="edit-link" onClick={() => handleEditSection('bio')}>
                      <ion-icon name="create-outline"></ion-icon> Edit
                    </button>
                  )}
                </div>
                <div className="card-content">
                  {editingSection === 'bio' ? (
                    <div className="bio-edit">
                      <textarea name="bio" value={profile.bio} onChange={handleChange} rows="6" className="bio-textarea"></textarea>
                      <div className="edit-actions">
                        <button className="btn-cancel" onClick={handleCancelEdit} disabled={saving}>Cancel</button>
                        <button className="btn-save" onClick={handleSaveSection} disabled={saving}>
                          {saving ? 'Saving...' : 'Save changes'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="info-value">{profile.bio}</div>
                  )}
                </div>
              </section>
            </div>

            {/* Completion Widget */}
            <aside className="profile-completion">
              <div className="completion-card">
                <h3>Complete your profile</h3>
                <div className="completion-circle">
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                    <circle 
                      cx="60" 
                      cy="60" 
                      r="54" 
                      fill="none" 
                      stroke="#10b981" 
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 54}`}
                      strokeDashoffset={`${2 * Math.PI * 54 * (1 - completionData.totalPercentage / 100)}`}
                      strokeLinecap="round"
                      transform="rotate(-90 60 60)"
                    />
                  </svg>
                  <div className="completion-percentage">{completionData.totalPercentage}%</div>
                </div>
                <ul className="completion-list">
                  {completionData.items.map((item, idx) => (
                    <li key={idx} className={item.completed ? 'completed' : ''}>
                      <ion-icon name={item.completed ? 'checkmark-outline' : 'close-outline'}></ion-icon>
                      <span>{item.label}</span>
                      <span className={`completion-points ${item.completed ? 'completed' : ''}`}>
                        {item.completed ? '' : '+'}{item.percentage}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
