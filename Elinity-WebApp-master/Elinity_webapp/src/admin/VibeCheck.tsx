import React from "react";
import { getVibeCheckData } from "./adminService";
import "./Admin.css";

const moodEmojis = {
  energetic: "⚡",
  calm: "🧘",
  romantic: "💕",
  social: "🤝",
  introspective: "🤔",
};

export default function VibeCheck() {
  const vibes = getVibeCheckData();

  const moodCounts = vibes.reduce(
    (acc, vibe) => {
      acc[vibe.mood] = (acc[vibe.mood] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const averageIntensity =
    vibes.reduce((sum, v) => sum + v.intensity, 0) / vibes.length || 0;

  return (
    <div className="vibe-check-container">
      <h1>Vibe Check</h1>
      <p className="section-subtitle">Community mood and energy levels in real-time</p>

      <div className="vibe-stats">
        <div className="vibe-stat-card">
          <span className="stat-label">Average Vibe Intensity</span>
          <div className="intensity-bar">
            <div
              className="intensity-fill"
              style={{ width: `${(averageIntensity / 10) * 100}%` }}
            ></div>
          </div>
          <span className="intensity-value">{averageIntensity.toFixed(1)}/10</span>
        </div>

        <div className="mood-distribution">
          <h3>Mood Distribution</h3>
          <div className="mood-grid">
            {Object.entries(moodCounts).map(([mood, count]) => (
              <div key={mood} className="mood-item">
                <span className="mood-emoji">
                  {moodEmojis[mood as keyof typeof moodEmojis]}
                </span>
                <span className="mood-name">{mood}</span>
                <span className="mood-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="vibes-list">
        <h2>Recent Vibe Entries</h2>
        <div className="vibe-entries">
          {vibes.map((vibe) => (
            <div key={vibe.id} className="vibe-entry">
              <div className="vibe-entry-header">
                <span className="vibe-emoji">
                  {moodEmojis[vibe.mood as keyof typeof moodEmojis]}
                </span>
                <div className="vibe-header-text">
                  <span className="vibe-mood">{vibe.mood}</span>
                  <span className="vibe-user">User: {vibe.userId}</span>
                </div>
                <span className="vibe-time">
                  {vibe.timestamp.toLocaleTimeString()}
                </span>
              </div>

              <p className="vibe-description">{vibe.description}</p>

              <div className="vibe-intensity">
                <span>Intensity:</span>
                <div className="intensity-dots">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <span
                      key={i}
                      className={`dot ${i < vibe.intensity ? "filled" : ""}`}
                    ></span>
                  ))}
                </div>
                <span className="intensity-number">{vibe.intensity}/10</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="vibe-insights">
        <h2>Vibe Insights</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>Peak Vibe Times</h4>
            <p>Community shows highest energy between 6 PM - 9 PM EST</p>
          </div>
          <div className="insight-card">
            <h4>Most Common Mood</h4>
            <p>
              {Object.entries(moodCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ||
                "N/A"}
            </p>
          </div>
          <div className="insight-card">
            <h4>Engagement Quality</h4>
            <p>86% of entries include detailed mood descriptions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
