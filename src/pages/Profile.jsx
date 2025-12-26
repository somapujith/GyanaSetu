import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    fullName: 'Ronald Richards',
    email: 'RonaldRich@example.com',
    phone: '(219) 555-0114',
    location: 'California',
    bio: 'Hi 👋, I\'m Ronald, a passionate UX designer with 10 of experience in creating intuitive and user-centered digital experiences. With a strong background in user research, information architecture, and interaction design, I am dedicated to crafting seamless and delightful user journeys.',
    photo: null,
    photoPreview: null,
  });
  const [editingSection, setEditingSection] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = e => {
    const file = e.target.files[0];
    if (file) {
      setProfile(prev => ({ ...prev, photo: file, photoPreview: URL.createObjectURL(file) }));
    }
  };

  const handleEditSection = section => setEditingSection(section);
  const handleCancelEdit = () => setEditingSection(null);
  const handleSaveSection = () => {
    // TODO: Save to backend
    setEditingSection(null);
  };

  const completionPercentage = 40;
  const completionItems = [
    { label: 'Setup account', percentage: 10, completed: true },
    { label: 'Upload your photo', percentage: 5, completed: true },
    { label: 'Personal Info', percentage: 10, completed: true },
    { label: 'Location', percentage: 20, completed: false },
    { label: 'Biography', percentage: 15, completed: false },
    { label: 'Notifications', percentage: 10, completed: false },
    { label: 'Bank details', percentage: 30, completed: false },
  ];

  return (
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
                  {profile.photoPreview ? (
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
                  />
                </label>
                <div className="photo-info">
                  <h3>Upload new photo</h3>
                  <p>At least 800×800 px recommended.<br />JPG or PNG is allowed</p>
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
                        <button className="btn-cancel" onClick={handleCancelEdit}>Cancel</button>
                        <button className="btn-save" onClick={handleSaveSection}>Save changes</button>
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
                      strokeDashoffset={`${2 * Math.PI * 54 * (1 - completionPercentage / 100)}`}
                      strokeLinecap="round"
                      transform="rotate(-90 60 60)"
                    />
                  </svg>
                  <div className="completion-percentage">{completionPercentage}%</div>
                </div>
                <ul className="completion-list">
                  {completionItems.map((item, idx) => (
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
  );
}
