import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdChevronLeft, MdPerson, MdSearch, MdOutlineNotificationsNone, MdOutlineSettings
} from "react-icons/md";
import { FaMapMarkerAlt, FaBriefcase, FaHeart } from "react-icons/fa";
import Sidebar from "./Sidebar";
import "../App.css";

import { useProfile } from "../profiles/ProfileContext";

const RomanticMatchSuccessPage: React.FC = () => {
  const { profile } = useProfile();
  // Placeholder user data
  const user1 = {
    name: profile.displayName,
    age: profile.age,
    gender: profile.gender === "Male" ? "M" : profile.gender === "Female" ? "F" : "O",
    location: profile.location,
    description: profile.about,
    image: profile.profileImg,
    profession: "Elinity User",
  };
  const user2 = {
    name: "Noah Hemsworth",
    age: 32,
    gender: "M",
    location: "Sao Paulo, BR",
    description: "Travel Photographer & Food Blogger",
    image: "data:image/jpeg;base64,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",
    profession: "Travel Photographer & Food Blogger",
  };
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="home-root">
      <Sidebar />
      <main className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-center">
            <div style={{ position: 'relative', width: '420px', maxWidth: '100%' }}>
              <span className="search-bar-icon"><MdSearch /></span>
              <input className="search-bar" placeholder="Search..." />
            </div>
          </div>
          <div className="topbar-actions" style={{ alignItems: 'center', display: 'flex', gap: '20px' }}>
            <button className="topbar-icon"><MdOutlineNotificationsNone /></button>
            <button className="topbar-icon"><MdOutlineSettings /></button>
            <div className="topbar-divider" />
            <div style={{ position: 'relative' }}>
              <div className="topbar-avatar" style={{ cursor: 'pointer' }} onClick={() => setShowDropdown((v) => !v)}>
                <img src={profile.profileImg} alt="avatar" />
              </div>
              {showDropdown && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  background: '#23235b',
                  border: '1px solid #a259e6',
                  borderRadius: 8,
                  boxShadow: '0 2px 8px #0003',
                  zIndex: 1000,
                  minWidth: 140,
                }}>
                  <button style={{ width: '100%', padding: 8, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>View Profile</button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Match Success Content */}
        <div className="content-wrapper">
          <div className="match-success-bg match-success-main">
            <div className="match-success-bgcard">
              <div className="match-success-chip-float-wrapper">
                <span className="match-success-chip">
                  <span className="chip-arrow"><MdChevronLeft /></span>
                  Romantic Matchup
                  <span className="chip-icon-glass"><FaHeart /></span>
                </span>
              </div>
              <h2 className="match-success-title">And we have a match!</h2>
              <div className="match-success-cards-row">
                {/* User 1 Card */}
                <div className="match-success-user-card modern-card">
                  <div className="modern-card-img-wrapper">
                    <img src={user1.image} alt={user1.name} className="match-success-user-img modern-card-img" />
                    <div className="modern-card-info-overlay">
                      <div className="match-success-user-name">{user1.name}</div>
                      <div className="match-success-user-age-gender">{user1.age} {user1.gender}</div>
                      <div className="match-success-user-location"><FaMapMarkerAlt className="icon-detail" /> {user1.location}</div>
                      <div className="match-success-user-desc"><FaBriefcase className="icon-detail" /> {user1.profession}</div>
                    </div>
                  </div>
                </div>
                {/* Heart Icon */}
                <div className="match-success-heart-wrapper">
                  <img src="/Heart.png" alt="Heart" className="match-success-heart-img" />
                </div>
                {/* User 2 Card */}
                <div className="match-success-user-card modern-card">
                  <div className="modern-card-img-wrapper">
                    <img src={user2.image} alt={user2.name} className="match-success-user-img modern-card-img" />
                    <div className="modern-card-info-overlay">
                      <div className="match-success-user-name">{user2.name}</div>
                      <div className="match-success-user-age-gender">{user2.age} {user2.gender}</div>
                      <div className="match-success-user-location"><FaMapMarkerAlt className="icon-detail" /> {user2.location}</div>
                      <div className="match-success-user-desc"><FaBriefcase className="icon-detail" /> {user2.profession}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="match-success-actions">
                <button className="match-success-btn match-success-btn-primary glassy-btn" onClick={() => alert('Message sent!')}>
                  <span className="btn-icon" role="img" aria-label="chat">💬</span> Send a Message
                </button>
                <button className="match-success-btn match-success-btn-secondary glassy-btn" onClick={() => alert('Viewing profile!')}>
                  <span className="btn-icon" role="img" aria-label="profile"><MdPerson /></span> View Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RomanticMatchSuccessPage; 
