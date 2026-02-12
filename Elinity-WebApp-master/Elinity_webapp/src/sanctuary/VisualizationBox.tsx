import React, { useState } from 'react';
import { MdVisibility, MdPlayArrow, MdImage, MdNature } from 'react-icons/md';

const VisualizationBox: React.FC = () => {
  const [selectedScene, setSelectedScene] = useState('beach');

  const scenes = [
    { id: 'beach', name: 'Beach', icon: '🌊' },
    { id: 'forest', name: 'Forest', icon: '🌲' },
    { id: 'mountain', name: 'Mountain', icon: '⛰️' },
    { id: 'garden', name: 'Garden', icon: '🌸' },
    { id: 'space', name: 'Space', icon: '✨' },
  ];

  return (
    <div className="sanctuary-box visualization-box">
      <div className="box-header">
        <div className="box-icon visualization-icon">
          <MdVisibility />
        </div>
        <h2 className="box-title">Visualization</h2>
      </div>
      <p className="box-description">
        Create and explore peaceful mental landscapes to enhance focus and relaxation.
      </p>

      <div className="visualization-content">
        <div className="scene-selector">
          <h3 className="section-title">Choose Your Scene</h3>
          <div className="scene-grid">
            {scenes.map((scene) => (
              <button
                key={scene.id}
                className={`scene-card ${selectedScene === scene.id ? 'active' : ''}`}
                onClick={() => setSelectedScene(scene.id)}
              >
                <span className="scene-emoji">{scene.icon}</span>
                <span className="scene-name">{scene.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="visualization-preview">
          <div className="preview-window">
            <div className="preview-content">
              <MdNature className="preview-icon" />
              <p className="preview-text">
                {scenes.find(s => s.id === selectedScene)?.name} Visualization
              </p>
            </div>
          </div>
          <button className="start-visualization-btn">
            <MdPlayArrow /> Start Visualization
          </button>
        </div>

        <div className="visualization-features">
          <div className="feature-item">
            <MdImage />
            <span>Custom Scenes</span>
          </div>
          <div className="feature-item">
            <MdNature />
            <span>Nature Sounds</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizationBox;
