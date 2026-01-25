import React, { useState } from 'react';
import { MdPalette, MdBrush, MdSave, MdUndo, MdRedo } from 'react-icons/md';

const LifePaintingBox: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState('#a259e6');
  const [brushSize, setBrushSize] = useState(5);

  const colors = [
    '#a259e6', '#3a6cf6', '#ff6b6b', '#4ecdc4', '#ffe66d',
    '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff6348'
  ];

  return (
    <div className="sanctuary-box life-painting-box">
      <div className="box-header">
        <div className="box-icon painting-icon">
          <MdPalette />
        </div>
        <h2 className="box-title">Life Painting</h2>
      </div>
      <p className="box-description">
        Express yourself through digital art. Paint your emotions, dreams, and aspirations.
      </p>

      <div className="painting-content">
        <div className="painting-toolbar">
          <div className="color-picker">
            <h3 className="toolbar-title">Colors</h3>
            <div className="color-grid">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`color-swatch ${selectedColor === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          <div className="brush-controls">
            <h3 className="toolbar-title">Brush Size</h3>
            <div className="brush-slider">
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="brush-range"
              />
              <span className="brush-size-value">{brushSize}px</span>
            </div>
          </div>

          <div className="painting-actions">
            <button className="action-btn" title="Undo">
              <MdUndo />
            </button>
            <button className="action-btn" title="Redo">
              <MdRedo />
            </button>
            <button className="action-btn save-btn" title="Save">
              <MdSave />
            </button>
          </div>
        </div>

        <div className="painting-canvas-container">
          <div className="painting-canvas">
            <div className="canvas-placeholder">
              <MdBrush className="canvas-icon" />
              <p className="canvas-hint">Click and drag to paint</p>
              <p className="canvas-subhint">Express your creativity</p>
            </div>
          </div>
        </div>

        <div className="painting-gallery">
          <h3 className="gallery-title">Your Creations</h3>
          <div className="gallery-grid">
            <div className="gallery-item">New Canvas</div>
            <div className="gallery-item">+</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifePaintingBox;
