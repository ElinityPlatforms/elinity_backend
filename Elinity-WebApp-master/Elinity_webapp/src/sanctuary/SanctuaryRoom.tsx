import React, { useState } from 'react';
import {
  MdSearch, MdOutlineNotificationsNone, MdOutlineSettings
} from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import '../HomePage.css';
import './SanctuaryRoom.css';
import MeditationBox from './MeditationBox';
import VisualizationBox from './VisualizationBox';
import LifePaintingBox from './LifePaintingBox';
import IntentionsBox from './IntentionsBox';
import AICoachRoomBox from './AICoachRoomBox';
import Sidebar from '../components/Sidebar';

const SanctuaryRoom: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="sanctuary-room-content" style={{ padding: '24px' }}>

      {/* Sanctuary Room Header */}
      <section className="sanctuary-header">
        <h1 className="sanctuary-title">Personal Sanctuary</h1>
        <p className="sanctuary-subtitle">Your space for mindfulness, growth, and self-discovery</p>
      </section>

      {/* Sanctuary Boxes Grid */}
      <section className="sanctuary-grid">
        <MeditationBox />
        <VisualizationBox />
        <LifePaintingBox />
        <IntentionsBox />
        <AICoachRoomBox />
      </section>
    </div>
  );
};

export default SanctuaryRoom;

