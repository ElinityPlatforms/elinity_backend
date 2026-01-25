import React, { useState } from 'react';
import { MdEdit, MdVisibility, MdLocationOn, MdWork, MdSchool, MdFavorite, MdPhotoCamera, MdAdd } from 'react-icons/md';
import { FaHeart, FaHandshake, FaUmbrellaBeach } from 'react-icons/fa';

type ViewMode = 'self' | 'others';
type ProfileMode = 'romantic' | 'leisure' | 'collaborative';

const RichProfileView: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('self');
  const [isEditing, setIsEditing] = useState(false);
  const [activeMode, setActiveMode] = useState<ProfileMode>('romantic');

  const profileData = {
    name: "Suraj",
    age: 28,
    location: "New York, NY",
    profession: "Product Designer",
    bio: "Creative designer passionate about building meaningful experiences. Love exploring new places, trying new cuisines, and connecting with interesting people.",
    images: [
      "https://randomuser.me/api/portraits/men/32.jpg",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
    ],
    interests: ["Design", "Travel", "Photography", "Music", "Cooking", "Hiking"],
    tags: {
      romantic: ["Romantic", "Adventurous", "Creative", "Thoughtful"],
      leisure: ["Outdoor", "Foodie", "Traveler", "Active"],
      collaborative: ["Innovative", "Team Player", "Problem Solver", "Creative"]
    },
    education: "Bachelor's in Design",
    work: "Product Designer at Tech Company"
  };

  const getModeIcon = (mode: ProfileMode) => {
    switch (mode) {
      case 'romantic': return <FaHeart />;
      case 'leisure': return <FaUmbrellaBeach />;
      case 'collaborative': return <FaHandshake />;
    }
  };

  const getModeColor = (mode: ProfileMode) => {
    switch (mode) {
      case 'romantic': return '#ff6b9d';
      case 'leisure': return '#4ecdc4';
      case 'collaborative': return '#a259e6';
    }
  };

  return (
    <div className="rich-profile-view">
      <div className="profile-view-header">
        <div className="view-mode-toggle">
          <button
            className={`view-mode-btn ${viewMode === 'self' ? 'active' : ''}`}
            onClick={() => setViewMode('self')}
          >
            <MdEdit /> Self View
          </button>
          <button
            className={`view-mode-btn ${viewMode === 'others' ? 'active' : ''}`}
            onClick={() => setViewMode('others')}
          >
            <MdVisibility /> View by Others
          </button>
        </div>
        {viewMode === 'self' && (
          <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
            <MdEdit /> {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        )}
      </div>

      <div className="profile-mode-selector">
        <button
          className={`mode-btn ${activeMode === 'romantic' ? 'active' : ''}`}
          onClick={() => setActiveMode('romantic')}
          style={{ borderColor: activeMode === 'romantic' ? getModeColor('romantic') : 'transparent' }}
        >
          <FaHeart /> Romantic Profile
        </button>
        <button
          className={`mode-btn ${activeMode === 'leisure' ? 'active' : ''}`}
          onClick={() => setActiveMode('leisure')}
          style={{ borderColor: activeMode === 'leisure' ? getModeColor('leisure') : 'transparent' }}
        >
          <FaUmbrellaBeach /> Leisure Profile
        </button>
        <button
          className={`mode-btn ${activeMode === 'collaborative' ? 'active' : ''}`}
          onClick={() => setActiveMode('collaborative')}
          style={{ borderColor: activeMode === 'collaborative' ? getModeColor('collaborative') : 'transparent' }}
        >
          <FaHandshake /> Collaborative Profile
        </button>
      </div>

      <div className="profile-container">
        <div className="profile-main-section">
          <div className="profile-images-section">
            <div className="profile-main-image">
              <img src={profileData.images[0]} alt={profileData.name} />
              {isEditing && (
                <button className="edit-image-btn">
                  <MdPhotoCamera /> Change Photo
                </button>
              )}
            </div>
            <div className="profile-thumbnails">
              {profileData.images.slice(1).map((img, idx) => (
                <div key={idx} className="thumbnail">
                  <img src={img} alt={`${profileData.name} ${idx + 2}`} />
                  {isEditing && (
                    <button className="remove-image-btn">×</button>
                  )}
                </div>
              ))}
              {isEditing && profileData.images.length < 6 && (
                <div className="thumbnail add-thumbnail">
                  <MdAdd />
                  <span>Add Photo</span>
                </div>
              )}
            </div>
          </div>

          <div className="profile-info-section">
            <div className="profile-name-section">
              <h1>{profileData.name}, {profileData.age}</h1>
              <div className="profile-mode-indicator" style={{ backgroundColor: getModeColor(activeMode) }}>
                {getModeIcon(activeMode)}
                <span>{activeMode.charAt(0).toUpperCase() + activeMode.slice(1)} Profile</span>
              </div>
            </div>

            <div className="profile-details-grid">
              <div className="detail-card">
                <MdLocationOn className="detail-icon" />
                <div>
                  <span className="detail-label">Location</span>
                  {isEditing ? (
                    <input type="text" defaultValue={profileData.location} className="edit-input" />
                  ) : (
                    <span className="detail-value">{profileData.location}</span>
                  )}
                </div>
              </div>

              <div className="detail-card">
                <MdWork className="detail-icon" />
                <div>
                  <span className="detail-label">Profession</span>
                  {isEditing ? (
                    <input type="text" defaultValue={profileData.profession} className="edit-input" />
                  ) : (
                    <span className="detail-value">{profileData.profession}</span>
                  )}
                </div>
              </div>

              <div className="detail-card">
                <MdSchool className="detail-icon" />
                <div>
                  <span className="detail-label">Education</span>
                  {isEditing ? (
                    <input type="text" defaultValue={profileData.education} className="edit-input" />
                  ) : (
                    <span className="detail-value">{profileData.education}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="profile-bio-section">
              <h3>About Me</h3>
              {isEditing ? (
                <textarea
                  defaultValue={profileData.bio}
                  className="edit-textarea"
                  rows={4}
                />
              ) : (
                <p>{profileData.bio}</p>
              )}
            </div>

            <div className="profile-interests-section">
              <h3>Interests</h3>
              <div className="interests-list">
                {profileData.interests.map((interest, idx) => (
                  <span key={idx} className="interest-badge">
                    {interest}
                    {isEditing && <button className="remove-interest">×</button>}
                  </span>
                ))}
                {isEditing && (
                  <button className="add-interest-btn">
                    <MdAdd /> Add Interest
                  </button>
                )}
              </div>
            </div>

            <div className="profile-tags-section">
              <h3>{activeMode.charAt(0).toUpperCase() + activeMode.slice(1)} Tags</h3>
              <div className="tags-list">
                {profileData.tags[activeMode].map((tag, idx) => (
                  <span key={idx} className="tag-badge" style={{ backgroundColor: getModeColor(activeMode) + '20', color: getModeColor(activeMode) }}>
                    {tag}
                    {isEditing && <button className="remove-tag">×</button>}
                  </span>
                ))}
                {isEditing && (
                  <button className="add-tag-btn" style={{ borderColor: getModeColor(activeMode) }}>
                    <MdAdd /> Add Tag
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {viewMode === 'others' && (
          <div className="profile-preview-section">
            <h3>How Others See Your Profile</h3>
            <div className="preview-card">
              <p>This is how your {activeMode} profile appears to potential matches.</p>
              <div className="preview-stats">
                <div className="preview-stat">
                  <span className="stat-number">1,234</span>
                  <span className="stat-label">Profile Views</span>
                </div>
                <div className="preview-stat">
                  <span className="stat-number">89</span>
                  <span className="stat-label">Likes Received</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RichProfileView;
