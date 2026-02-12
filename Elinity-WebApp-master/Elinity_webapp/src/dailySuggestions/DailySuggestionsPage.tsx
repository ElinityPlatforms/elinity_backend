import React, { useEffect, useState } from "react";
import { getDailySuggestions } from "./dailySuggestionsService";
import type { SuggestionProfile } from "./types";
import DailySuggestionCard from "./DailySuggestionCard";
import "./DailySuggestions.css";

export default function DailySuggestionsPage() {
  const [profiles, setProfiles] = useState<SuggestionProfile[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async (count = 5) => {
    setLoading(true);
    try {
      const items = await getDailySuggestions(count);
      setProfiles(items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(5);
  }, []);

  return (
    <div className="ds-page">
      <header className="ds-header">
        <h2>Daily Suggestions</h2>
        <div className="ds-actions">
          <button onClick={() => load(3)}>Show 3</button>
          <button onClick={() => load(5)}>Show 5</button>
          <button onClick={() => load(8)}>Show 8</button>
          <button onClick={() => load()} className="secondary">Refresh</button>
        </div>
      </header>

      {loading && <div className="ds-loading">Loading suggestions…</div>}

      <div className="ds-list">
        {profiles.map((p) => (
          <DailySuggestionCard key={p.id} profile={p} />
        ))}
      </div>
    </div>
  );
}
