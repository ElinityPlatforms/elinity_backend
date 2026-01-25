import React, { useState } from 'react';
import { MdFavorite, MdClose, MdRefresh, MdMoreVert, MdLocationOn, MdWork, MdSchool, MdFavoriteBorder } from 'react-icons/md';
import { FaHeart, FaHandshake, FaUmbrellaBeach } from 'react-icons/fa';

interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  profession: string;
  image: string;
  compatibility: number;
  mode: 'romantic' | 'leisure' | 'collaborative';
  tags: string[];
  bio: string;
  interests: string[];
}

const mockProfiles: Profile[] = [
  {
    id: 1,
    name: "Emma Wilson",
    age: 28,
    location: "San Francisco, CA",
    profession: "UX Designer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    compatibility: 94,
    mode: 'romantic',
    tags: ["Design", "Art", "Travel", "Yoga"],
    bio: "Creative soul who loves exploring new places and finding beauty in everyday moments.",
    interests: ["Photography", "Hiking", "Coffee", "Music"]
  },
  {
    id: 2,
    name: "Alex Chen",
    age: 32,
    location: "New York, NY",
    profession: "Software Engineer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    compatibility: 87,
    mode: 'collaborative',
    tags: ["Tech", "Startups", "Innovation", "Networking"],
    bio: "Building the future one line of code at a time. Always open to collaborate on exciting projects.",
    interests: ["Coding", "Entrepreneurship", "Tech Talks", "Hackathons"]
  },
  {
    id: 3,
    name: "Sophie Martinez",
    age: 26,
    location: "Miami, FL",
    profession: "Marketing Manager",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    compatibility: 91,
    mode: 'leisure',
    tags: ["Beach", "Fitness", "Food", "Adventure"],
    bio: "Sunset chaser and adventure seeker. Life's too short to stay indoors!",
    interests: ["Surfing", "Cooking", "Travel", "Fitness"]
  }
];

const RichProfilesMatching: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>(mockProfiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedProfiles, setLikedProfiles] = useState<number[]>([]);
  const [showDropdown, setShowDropdown] = useState<{ [key: number]: boolean }>({});

  const currentProfile = profiles[currentIndex];

  const handleLike = () => {
    if (currentProfile) {
      setLikedProfiles([...likedProfiles, currentProfile.id]);
      if (currentIndex < profiles.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Reset or load more profiles
        setCurrentIndex(0);
      }
    }
  };

  const handlePass = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleRefresh = () => {
    // Shuffle profiles or load new ones
    setProfiles([...mockProfiles].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
  };

  const toggleDropdown = (id: number) => {
    setShowDropdown({ ...showDropdown, [id]: !showDropdown[id] });
  };

  if (!currentProfile) {
    return (
      <div className="matching-empty">
        <p>No more profiles to show. Check back later!</p>
        <button className="refresh-btn" onClick={handleRefresh}>
          <MdRefresh /> Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="rich-profiles-matching">
      <div className="matching-stats">
        <div className="stat-card">
          <span className="stat-value">{profiles.length}</span>
          <span className="stat-label">Profiles Available</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{likedProfiles.length}</span>
          <span className="stat-label">Liked</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{currentProfile.compatibility}%</span>
          <span className="stat-label">Compatibility</span>
        </div>
      </div>

      <div className="profile-card-container">
        <div className="profile-card">
          <div className="profile-image-wrapper">
            <img src={currentProfile.image} alt={currentProfile.name} className="profile-image" />
            <div className="profile-overlay">
              <div className="profile-header-info">
                <h2 className="profile-name">{currentProfile.name}, {currentProfile.age}</h2>
                <div className="profile-mode-badge">
                  {currentProfile.mode === 'romantic' && <FaHeart />}
                  {currentProfile.mode === 'leisure' && <FaUmbrellaBeach />}
                  {currentProfile.mode === 'collaborative' && <FaHandshake />}
                  <span>{currentProfile.mode.charAt(0).toUpperCase() + currentProfile.mode.slice(1)}</span>
                </div>
              </div>
            </div>
            <div className="profile-actions-top">
              <button className="action-btn-icon" onClick={() => toggleDropdown(currentProfile.id)}>
                <MdMoreVert />
              </button>
              {showDropdown[currentProfile.id] && (
                <div className="dropdown-menu">
                  <button>View Full Profile</button>
                  <button>Report</button>
                </div>
              )}
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-details">
              <div className="detail-item">
                <MdLocationOn /> <span>{currentProfile.location}</span>
              </div>
              <div className="detail-item">
                <MdWork /> <span>{currentProfile.profession}</span>
              </div>
            </div>

            <div className="profile-bio">
              <p>{currentProfile.bio}</p>
            </div>

            <div className="profile-interests">
              <h3>Interests</h3>
              <div className="interests-grid">
                {currentProfile.interests.map((interest, idx) => (
                  <span key={idx} className="interest-tag">{interest}</span>
                ))}
              </div>
            </div>

            <div className="profile-tags">
              {currentProfile.tags.map((tag, idx) => (
                <span key={idx} className="tag">{tag}</span>
              ))}
            </div>

            <div className="compatibility-bar">
              <div className="compatibility-label">
                <span>Compatibility Score</span>
                <span className="compatibility-value">{currentProfile.compatibility}%</span>
              </div>
              <div className="compatibility-progress">
                <div
                  className="compatibility-fill"
                  style={{ width: `${currentProfile.compatibility}%` }}
                />
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="action-btn pass-btn" onClick={handlePass}>
              <MdClose />
            </button>
            <button className="action-btn like-btn" onClick={handleLike}>
              <MdFavorite />
            </button>
            <button className="action-btn refresh-btn-small" onClick={handleRefresh}>
              <MdRefresh />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RichProfilesMatching;
