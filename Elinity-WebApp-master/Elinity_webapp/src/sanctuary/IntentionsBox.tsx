import React, { useState } from 'react';
import { MdLightbulb, MdAdd, MdCheckCircle, MdEdit, MdDelete } from 'react-icons/md';

interface Intention {
  id: number;
  text: string;
  completed: boolean;
  date: string;
}

const IntentionsBox: React.FC = () => {
  const [intentions, setIntentions] = useState<Intention[]>([
    { id: 1, text: 'Practice gratitude daily', completed: false, date: new Date().toISOString() },
    { id: 2, text: 'Meditate for 10 minutes each morning', completed: true, date: new Date().toISOString() },
    { id: 3, text: 'Be present in conversations', completed: false, date: new Date().toISOString() },
  ]);
  const [newIntention, setNewIntention] = useState('');

  const addIntention = () => {
    if (newIntention.trim()) {
      setIntentions([
        ...intentions,
        {
          id: intentions.length + 1,
          text: newIntention,
          completed: false,
          date: new Date().toISOString(),
        },
      ]);
      setNewIntention('');
    }
  };

  const toggleIntention = (id: number) => {
    setIntentions(
      intentions.map((intention) =>
        intention.id === id
          ? { ...intention, completed: !intention.completed }
          : intention
      )
    );
  };

  const deleteIntention = (id: number) => {
    setIntentions(intentions.filter((intention) => intention.id !== id));
  };

  return (
    <div className="sanctuary-box intentions-box">
      <div className="box-header">
        <div className="box-icon intentions-icon">
          <MdLightbulb />
        </div>
        <h2 className="box-title">Intentions</h2>
      </div>
      <p className="box-description">
        Set daily intentions and affirmations to guide your journey and manifest your goals.
      </p>

      <div className="intentions-content">
        <div className="add-intention">
          <input
            type="text"
            className="intention-input"
            placeholder="What's your intention for today?"
            value={newIntention}
            onChange={(e) => setNewIntention(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addIntention()}
          />
          <button className="add-intention-btn" onClick={addIntention}>
            <MdAdd /> Add
          </button>
        </div>

        <div className="intentions-list">
          <h3 className="list-title">Today's Intentions</h3>
          {intentions.length === 0 ? (
            <div className="empty-state">
              <p>No intentions set yet. Add one to get started!</p>
            </div>
          ) : (
            <div className="intention-items">
              {intentions.map((intention) => (
                <div
                  key={intention.id}
                  className={`intention-item ${intention.completed ? 'completed' : ''}`}
                >
                  <button
                    className="intention-check"
                    onClick={() => toggleIntention(intention.id)}
                  >
                    <MdCheckCircle
                      className={intention.completed ? 'checked' : 'unchecked'}
                    />
                  </button>
                  <span className="intention-text">{intention.text}</span>
                  <div className="intention-actions">
                    <button className="intention-action-btn" title="Edit">
                      <MdEdit />
                    </button>
                    <button
                      className="intention-action-btn delete-btn"
                      onClick={() => deleteIntention(intention.id)}
                      title="Delete"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="intentions-stats">
          <div className="stat-item">
            <span className="stat-value">{intentions.filter(i => i.completed).length}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{intentions.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {intentions.length > 0
                ? Math.round((intentions.filter(i => i.completed).length / intentions.length) * 100)
                : 0}%
            </span>
            <span className="stat-label">Progress</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntentionsBox;
