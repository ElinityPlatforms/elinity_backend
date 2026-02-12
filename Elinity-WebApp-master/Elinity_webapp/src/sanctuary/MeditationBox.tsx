import React, { useState } from 'react';
import { MdSelfImprovement, MdPlayArrow, MdPause, MdTimer } from 'react-icons/md';

const MeditationBox: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(10);

  const durations = [5, 10, 15, 20, 30];

  return (
    <div className="sanctuary-box meditation-box">
      <div className="box-header">
        <div className="box-icon meditation-icon">
          <MdSelfImprovement />
        </div>
        <h2 className="box-title">Meditation</h2>
      </div>
      <p className="box-description">
        Guided mindfulness sessions to calm your mind and find inner peace.
      </p>
      
      <div className="meditation-controls">
        <div className="duration-selector">
          <span className="duration-label">Duration (minutes):</span>
          <div className="duration-buttons">
            {durations.map((duration) => (
              <button
                key={duration}
                className={`duration-btn ${selectedDuration === duration ? 'active' : ''}`}
                onClick={() => setSelectedDuration(duration)}
              >
                {duration}
              </button>
            ))}
          </div>
        </div>

        <div className="meditation-player">
          <button
            className="play-pause-btn"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <MdPause /> : <MdPlayArrow />}
          </button>
          <div className="meditation-info">
            <span className="meditation-status">
              {isPlaying ? 'In Session' : 'Ready to Begin'}
            </span>
            <span className="meditation-timer">
              <MdTimer /> {selectedDuration}:00
            </span>
          </div>
        </div>

        <div className="meditation-sessions">
          <h3 className="sessions-title">Quick Sessions</h3>
          <div className="session-list">
            <button className="session-item">Morning Calm</button>
            <button className="session-item">Stress Relief</button>
            <button className="session-item">Sleep Meditation</button>
            <button className="session-item">Focus & Clarity</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeditationBox;
