import React from "react";
import type { SuggestionProfile } from "./types";
import "./DailySuggestions.css";

export default function DailySuggestionCard({ profile }: { profile: SuggestionProfile }) {
  const score = profile.aiScore;
  const scoreColor = score >= 80 ? "--score-high" : score >= 65 ? "--score-medium" : "--score-low";

  return (
    <div className="ds-card">
      <div className="ds-card-main">
        <div className="ds-avatar">{profile.name.split(" ")[0].charAt(0)}</div>
        <div className="ds-info">
          <div className="ds-name">{profile.name}, {profile.age}</div>
          <div className="ds-bio">{profile.bio}</div>
        </div>
      </div>

      <div className="ds-ai">
        <div className="ds-score" style={{ ['--score' as any]: String(score) }}>
          <div className={`ds-score-bar ${scoreColor}`} style={{ width: `${score}%` }} />
          <div className="ds-score-label">AI Score: {score}</div>
        </div>
        <div className="ds-insight">{profile.aiInsight}</div>
      </div>
    </div>
  );
}
