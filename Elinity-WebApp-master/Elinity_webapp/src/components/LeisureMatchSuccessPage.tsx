import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdChevronLeft, MdPerson, MdSearch, MdOutlineNotificationsNone, MdOutlineSettings
} from "react-icons/md";
import { FaMapMarkerAlt, FaBriefcase, FaUmbrellaBeach } from "react-icons/fa";
import Sidebar from "./Sidebar";
import "../App.css";

import { useProfile } from "../profiles/ProfileContext";

const LeisureMatchSuccessPage: React.FC = () => {
  const { profile } = useProfile();
  const navigate = useNavigate();
  // Placeholder user data for leisure profile
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
    name: "Liam Carter",
    age: 29,
    gender: "M",
    location: "Gold Coast, AU",
    description: "Lifeguard & Paddleboarder",
    image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=facearea&w=400&h=400&facepad=2&q=80",
    profession: "Lifeguard & Paddleboarder",
  };
  const [showDropdown, setShowDropdown] = useState(false);
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
        {/* Leisure Match Success Content */}
        <div className="content-wrapper">
          <div className="match-success-bg match-success-main">
            <div className="match-success-bgcard">
              <div className="match-success-chip-float-wrapper">
                <span className="match-success-chip">
                  <span className="chip-arrow"><MdChevronLeft /></span>
                  Leisure Matchup
                  <span className="chip-icon-glass"><FaUmbrellaBeach /></span>
                </span>
              </div>
              <h2 className="match-success-title">You found a leisure buddy!</h2>
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
                {/* Beach Icon replaced with circle image */}
                <div className="match-success-heart-wrapper">
                  <img src="/Circle.png" alt="Circle" className="match-success-heart-img" />
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

export default LeisureMatchSuccessPage;