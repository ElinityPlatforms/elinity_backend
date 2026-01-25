import React, { useState } from 'react';
import { MdMessage, MdChevronLeft, MdFavorite, MdShare } from 'react-icons/md';
import { FaHeart, FaHandshake, FaUmbrellaBeach } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

type MatchType = 'romantic' | 'leisure' | 'collaborative';

interface MatchData {
  type: MatchType;
  user1: {
    name: string;
    age: number;
    image: string;
    location: string;
    profession: string;
  };
  user2: {
    name: string;
    age: number;
    image: string;
    location: string;
    profession: string;
  };
  compatibility: number;
  matchReasons: string[];
}

const MatchSuccessScreen: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMatchType, setSelectedMatchType] = useState<MatchType>('romantic');

  const matchExamples: { [key in MatchType]: MatchData } = {
    romantic: {
      type: 'romantic',
      user1: {
        name: "Alice Morgan",
        age: 28,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
        location: "San Francisco, CA",
        profession: "UX Designer"
      },
      user2: {
        name: "Suraj",
        age: 28,
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        location: "New York, NY",
        profession: "Product Designer"
      },
      compatibility: 94,
      matchReasons: [
        "Both value creativity and artistic expression",
        "Shared interest in design and innovation",
        "Compatible communication styles",
        "Similar life goals and values"
      ]
    },
    leisure: {
      type: 'leisure',
      user1: {
        name: "Sophie Turner",
        age: 26,
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
        location: "Miami, FL",
        profession: "Marketing Manager"
      },
      user2: {
        name: "Suraj",
        age: 28,
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        location: "New York, NY",
        profession: "Product Designer"
      },
      compatibility: 91,
      matchReasons: [
        "Shared love for outdoor activities",
        "Both enjoy exploring new places",
        "Compatible adventure levels",
        "Similar interests in food and travel"
      ]
    },
    collaborative: {
      type: 'collaborative',
      user1: {
        name: "Emma Williams",
        age: 31,
        image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
        location: "Berlin, Germany",
        profession: "UX Designer, Startup Mentor"
      },
      user2: {
        name: "Suraj",
        age: 28,
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        location: "New York, NY",
        profession: "Product Designer"
      },
      compatibility: 87,
      matchReasons: [
        "Complementary skill sets",
        "Both passionate about innovation",
        "Shared entrepreneurial mindset",
        "Great potential for collaboration"
      ]
    }
  };

  const currentMatch = matchExamples[selectedMatchType];

  const getMatchIcon = (type: MatchType) => {
    switch (type) {
      case 'romantic': return <FaHeart />;
      case 'leisure': return <FaUmbrellaBeach />;
      case 'collaborative': return <FaHandshake />;
    }
  };

  const getMatchTitle = (type: MatchType) => {
    switch (type) {
      case 'romantic': return "And we have a match!";
      case 'leisure': return "You found a leisure buddy!";
      case 'collaborative': return "Collaboration Success!";
    }
  };

  const getMatchColor = (type: MatchType) => {
    switch (type) {
      case 'romantic': return '#ff6b9d';
      case 'leisure': return '#4ecdc4';
      case 'collaborative': return '#a259e6';
    }
  };

  return (
    <div className="match-success-screen">
      <div className="match-type-selector">
        <button
          className={`match-type-btn ${selectedMatchType === 'romantic' ? 'active' : ''}`}
          onClick={() => setSelectedMatchType('romantic')}
          style={{ 
            borderColor: selectedMatchType === 'romantic' ? getMatchColor('romantic') : 'transparent',
            backgroundColor: selectedMatchType === 'romantic' ? getMatchColor('romantic') + '20' : 'transparent'
          }}
        >
          <FaHeart /> Romantic Match
        </button>
        <button
          className={`match-type-btn ${selectedMatchType === 'leisure' ? 'active' : ''}`}
          onClick={() => setSelectedMatchType('leisure')}
          style={{ 
            borderColor: selectedMatchType === 'leisure' ? getMatchColor('leisure') : 'transparent',
            backgroundColor: selectedMatchType === 'leisure' ? getMatchColor('leisure') + '20' : 'transparent'
          }}
        >
          <FaUmbrellaBeach /> Leisure Match
        </button>
        <button
          className={`match-type-btn ${selectedMatchType === 'collaborative' ? 'active' : ''}`}
          onClick={() => setSelectedMatchType('collaborative')}
          style={{ 
            borderColor: selectedMatchType === 'collaborative' ? getMatchColor('collaborative') : 'transparent',
            backgroundColor: selectedMatchType === 'collaborative' ? getMatchColor('collaborative') + '20' : 'transparent'
          }}
        >
          <FaHandshake /> Collaborative Match
        </button>
      </div>

      <div className="match-success-content">
        <div className="match-success-header">
          <div className="match-chip" style={{ backgroundColor: getMatchColor(selectedMatchType) + '20', color: getMatchColor(selectedMatchType) }}>
            <MdChevronLeft />
            {selectedMatchType.charAt(0).toUpperCase() + selectedMatchType.slice(1)} Matchup
            {getMatchIcon(selectedMatchType)}
          </div>
          <h1 className="match-success-title">{getMatchTitle(selectedMatchType)}</h1>
        </div>

        <div className="match-users-container">
          <div className="match-user-card">
            <div className="match-user-image-wrapper">
              <img src={currentMatch.user1.image} alt={currentMatch.user1.name} className="match-user-image" />
              <div className="match-user-overlay">
                <h3 className="match-user-name">{currentMatch.user1.name}</h3>
                <p className="match-user-age">{currentMatch.user1.age}</p>
                <p className="match-user-location">{currentMatch.user1.location}</p>
                <p className="match-user-profession">{currentMatch.user1.profession}</p>
              </div>
            </div>
          </div>

          <div className="match-heart-container">
            <div className="match-heart-icon" style={{ color: getMatchColor(selectedMatchType) }}>
              {getMatchIcon(selectedMatchType)}
            </div>
            <div className="match-compatibility-badge" style={{ backgroundColor: getMatchColor(selectedMatchType) }}>
              {currentMatch.compatibility}% Match
            </div>
          </div>

          <div className="match-user-card">
            <div className="match-user-image-wrapper">
              <img src={currentMatch.user2.image} alt={currentMatch.user2.name} className="match-user-image" />
              <div className="match-user-overlay">
                <h3 className="match-user-name">{currentMatch.user2.name}</h3>
                <p className="match-user-age">{currentMatch.user2.age}</p>
                <p className="match-user-location">{currentMatch.user2.location}</p>
                <p className="match-user-profession">{currentMatch.user2.profession}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="match-reasons-section">
          <h3>Why You're a Great Match</h3>
          <div className="match-reasons-list">
            {currentMatch.matchReasons.map((reason, idx) => (
              <div key={idx} className="match-reason-item">
                <MdFavorite className="reason-icon" style={{ color: getMatchColor(selectedMatchType) }} />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="match-actions">
          <button 
            className="match-action-btn primary"
            style={{ backgroundColor: getMatchColor(selectedMatchType) }}
            onClick={() => navigate('/chat')}
          >
            <MdMessage /> Send Message
          </button>
          <button className="match-action-btn secondary">
            <MdShare /> Share Match
          </button>
          <button className="match-action-btn secondary" onClick={() => navigate('/your-matches')}>
            View All Matches
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchSuccessScreen;
