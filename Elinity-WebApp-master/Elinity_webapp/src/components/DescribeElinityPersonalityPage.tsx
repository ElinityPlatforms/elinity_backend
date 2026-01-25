import React, { useState } from 'react';
import {
  MdHome, MdFavorite, MdAssignment, MdSearch, MdMessage, MdSettings, MdLogout,
  MdOutlineNotificationsNone, MdOutlineSettings, MdKeyboardVoice
} from 'react-icons/md';
import { FaGamepad } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../HomePage.css';
import './DescribeElinityPersonalityPage.css';

const DescribeElinityPersonalityPage: React.FC = () => {
  // Set document title
  React.useEffect(() => {
    document.title = 'Describe Elinity Personality';
    return () => {
      document.title = 'Elinity';
    };
  }, []);
  const navigate = useNavigate();
  const [activeSidebar, setActiveSidebar] = useState('home');
  const [showDropdown, setShowDropdown] = useState(false);
  
  // State for personality traits sliders
  const [playfulSerious1, setPlayfulSerious1] = useState(50);
  const [romanticPractical, setRomanticPractical] = useState(50);
  const [gentleBold, setGentleBold] = useState(50);
  const [spiritualScientific, setSpiritualScientific] = useState(50);
  const [playfulSerious2, setPlayfulSerious2] = useState(50);
  const [playfulSerious3, setPlayfulSerious3] = useState(50);
  
  // State for text inputs
  const [personalityDescription, setPersonalityDescription] = useState('');
  const [valuesMost, setValuesMost] = useState('');
  const [helpWith, setHelpWith] = useState('');
  const [anythingElse, setAnythingElse] = useState('');
  const [designLooks, setDesignLooks] = useState('');
  
  // State for avatar selection
  const [selectedAvatar, setSelectedAvatar] = useState(2); // Default to the middle avatar
  const [currentIndex, setCurrentIndex] = useState(0);

  // Avatar options
  const avatars = [
    'https://i.pravatar.cc/150?img=1',
    'https://i.pravatar.cc/150?img=2',
    'https://i.pravatar.cc/150?img=3',
    'https://i.pravatar.cc/150?img=4',
    'https://i.pravatar.cc/150?img=5'
  ];

  const prev = () => setCurrentIndex((curr) => (curr === 0 ? avatars.length - 1 : curr - 1));
  const next = () => setCurrentIndex((curr) => (curr === avatars.length - 1 ? 0 : curr + 1));

  return (
    <div className="home-root">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo" onClick={() => navigate('/describe-elinity-personality')} style={{ cursor: 'pointer' }}>
          <img src="/mainlogo.png" alt="Elinity logo" className="ee-logo-img" />
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-group main-icons">
            <button 
              className={`sidebar-icon${activeSidebar === "home" ? " active" : ""}`} 
              aria-label="Home" 
              onClick={() => { setActiveSidebar("home"); navigate("/"); }}
            >
              <MdHome />
              {activeSidebar === "home" && <span className="sidebar-active-bar" />}
            </button>
            <button 
              className={`sidebar-icon${activeSidebar === "favorite" ? " active" : ""}`} 
              aria-label="Favorites" 
              onClick={() => { setActiveSidebar("favorite"); navigate("/your-matches"); }}
            >
              <MdFavorite />
              {activeSidebar === "favorite" && <span className="sidebar-active-bar" />}
            </button>
            <button 
              className={`sidebar-icon${activeSidebar === "prompt" ? " active" : ""}`} 
              aria-label="Prompt" 
              onClick={() => { setActiveSidebar("prompt"); navigate("/prompt"); }}
            >
              <MdAssignment />
              {activeSidebar === "prompt" && <span className="sidebar-active-bar" />}
            </button>
            <button 
              className={`sidebar-icon${activeSidebar === "search" ? " active" : ""}`} 
              aria-label="Search" 
              onClick={() => setActiveSidebar("search")}
            >
              <MdSearch />
              {activeSidebar === "search" && <span className="sidebar-active-bar" />}
            </button>
            <button 
              className={`sidebar-icon${activeSidebar === "message" ? " active" : ""}`} 
              aria-label="Messages" 
              onClick={() => { setActiveSidebar("message"); navigate("/chat"); }}
            >
              <MdMessage />
              {activeSidebar === "message" && <span className="sidebar-active-bar" />}
            </button>
            <button 
              className={`sidebar-icon${activeSidebar === "games" ? " active" : ""}`} 
              aria-label="Games" 
              onClick={() => { setActiveSidebar("games"); navigate("/games"); }}
            >
              <FaGamepad />
              {activeSidebar === "games" && <span className="sidebar-active-bar" />}
            </button>
          </div>
          <div className="sidebar-divider" />
          <div className="sidebar-group secondary-icons">
            <button 
              className={`sidebar-icon${activeSidebar === "notifications" ? " active" : ""}`} 
              aria-label="Notifications" 
              onClick={() => setActiveSidebar("notifications")}
            >
              <MdOutlineNotificationsNone />
              {activeSidebar === "notifications" && <span className="sidebar-active-bar" />}
            </button>
            <button 
              className={`sidebar-icon${activeSidebar === "settings" ? " active" : ""}`} 
              aria-label="Settings" 
              onClick={() => setActiveSidebar("settings")}
            >
              <MdOutlineSettings />
              {activeSidebar === "settings" && <span className="sidebar-active-bar" />}
            </button>
          </div>
        </nav>
        <div className="sidebar-logout">
          <button className="sidebar-icon red" aria-label="Logout">
            <MdLogout />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="describe-elinity-personality-container">
        {/* Top Bar */}
        <div className="topbar">
          <div className="search-container">
            <input type="text" placeholder="Search" className="search-input" />
          </div>
          <div className="topbar-actions">
            <button className="icon-button">
              <MdOutlineNotificationsNone />
            </button>
            <button className="icon-button">
              <MdOutlineSettings />
            </button>
            <div className="user-avatar">
              <img src="https://i.pravatar.cc/150?img=68" alt="User" />
            </div>
          </div>
        </div>

        {/* Personality Profile Content */}
        <div className="describe-elinity-personality-content">
          <h2 className="personality-title">Describe Elinity Personality <span className="sparkle">✨</span></h2>
          
          {/* Personality Description */}
          <div className="personality-description-container">
            <textarea 
              className="personality-description" 
              placeholder="Talk to me like a calm best friend who's deeply curious..." 
              value={personalityDescription}
              onChange={(e) => setPersonalityDescription(e.target.value)}
            />
            <button className="voice-button">
              <MdKeyboardVoice />
            </button>
          </div>

          {/* Personality Traits Sliders */}
          <div className="personality-sliders-container">
            <div className="slider-container">
              <div className="slider-labels">
                <div className="slider-label">Playful 🎮</div>
                <div className="slider-label">Serious 🧐</div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={playfulSerious1}
                onChange={(e) => setPlayfulSerious1(parseInt(e.target.value))}
                className="personality-slider playful-serious"
              />
              <div className="slider-hint">Choose where you feel most comfortable...</div>
            </div>

            <div className="slider-container">
              <div className="slider-labels">
                <div className="slider-label">Romantic 💘</div>
                <div className="slider-label">Practical 🔧</div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={romanticPractical}
                onChange={(e) => setRomanticPractical(parseInt(e.target.value))}
                className="personality-slider romantic-practical"
              />
              <div className="slider-hint">Choose where you feel most comfortable...</div>
            </div>

            <div className="slider-container">
              <div className="slider-labels">
                <div className="slider-label">Gentle 🌸</div>
                <div className="slider-label">Bold 🔥</div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={gentleBold}
                onChange={(e) => setGentleBold(parseInt(e.target.value))}
                className="personality-slider gentle-bold"
              />
              <div className="slider-hint">Choose where you feel most comfortable...</div>
            </div>

            <div className="slider-container">
              <div className="slider-labels">
                <div className="slider-label">Spiritual ✨</div>
                <div className="slider-label">Scientific 🔬</div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={spiritualScientific}
                onChange={(e) => setSpiritualScientific(parseInt(e.target.value))}
                className="personality-slider spiritual-scientific"
              />
              <div className="slider-hint">Choose where you feel most comfortable...</div>
            </div>

            <div className="slider-container">
              <div className="slider-labels">
                <div className="slider-label">Playful 🎮</div>
                <div className="slider-label">Serious 🧐</div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={playfulSerious2}
                onChange={(e) => setPlayfulSerious2(parseInt(e.target.value))}
                className="personality-slider playful-serious"
              />
              <div className="slider-hint">Choose where you feel most comfortable...</div>
            </div>

            <div className="slider-container">
              <div className="slider-labels">
                <div className="slider-label">Playful 🎮</div>
                <div className="slider-label">Serious 🧐</div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={playfulSerious3}
                onChange={(e) => setPlayfulSerious3(parseInt(e.target.value))}
                className="personality-slider playful-serious"
              />
              <div className="slider-hint">Choose where you feel most comfortable...</div>
            </div>
          </div>

          {/* Additional Questions */}
          <div className="additional-questions-container">
            <div className="question-row">
              <div className="question-container">
                <h3>What does your Elinity Value Most</h3>
                <textarea 
                  className="question-input" 
                  placeholder="Empathy, Growth, Balance" 
                  value={valuesMost}
                  onChange={(e) => setValuesMost(e.target.value)}
                />
              </div>
              
              <div className="question-container">
                <h3>What should Elinity help you with</h3>
                <textarea 
                  className="question-input" 
                  placeholder="Deepen relationship, Heal from past" 
                  value={helpWith}
                  onChange={(e) => setHelpWith(e.target.value)}
                />
              </div>
            </div>

            <div className="question-row">
              <div className="question-container">
                <h3>Anything else you'd like Elinity to know</h3>
                <textarea 
                  className="question-input" 
                  placeholder="Always reflect back before offering advice..." 
                  value={anythingElse}
                  onChange={(e) => setAnythingElse(e.target.value)}
                />
              </div>
              
              <div className="question-container">
                <h3>Design what Elinity Looks like</h3>
                <textarea 
                  className="question-input" 
                  placeholder="How would you picture Elinity" 
                  value={designLooks}
                  onChange={(e) => setDesignLooks(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Avatar Selection */}
          <div className="avatar-selection-container">
            <button className="generate-look-button">Generate Look</button>
            
            <div className="avatars-carousel overflow-hidden relative">
              <div className="flex items-center justify-center h-full">
                {avatars.map((avatar, index) => {
                  const offset = (index - currentIndex + avatars.length) % avatars.length;
                  const isCenter = offset === 0;
                  const isLeft = offset === avatars.length - 1;
                  const isRight = offset === 1;

                  let transform = '';
                  if (isCenter) {
                    transform = 'translateX(0) scale(1)';
                  } else if (isLeft) {
                    transform = 'translateX(-50%) scale(0.8) rotateY(45deg)';
                  } else if (isRight) {
                    transform = 'translateX(50%) scale(0.8) rotateY(-45deg)';
                  } else {
                    transform = 'scale(0.6)';
                  }

                  return (
                    <img 
                      key={index}
                      src={avatar} 
                      alt={`Avatar option ${index + 1}`} 
                      className='w-full object-contain'
                      style={{
                        transform: transform,
                        opacity: isCenter ? 1 : 0.5,
                        zIndex: isCenter ? 10 : 1,
                      }}
                    />
                  )
                })}
              </div>

            </div>
            <div className="flex items-center justify-center p-4">
              <button onClick={prev} className="carousel-arrow left">&lt;</button>
              <button onClick={next} className="carousel-arrow right">&gt;</button>
            </div>

            <div className="avatar-actions">
              <button className="confirm-avatar-button">Confirm as Avatar</button>
              <button className="generate-new-look-button">Generate New Look</button>
            </div>

            <button className="save-continue-button">Save & Continue</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DescribeElinityPersonalityPage;