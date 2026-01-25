import React from 'react';
import './JournalPromptPage.css';
import { MdHome, MdFavorite, MdSearch, MdMessage, MdLogout, MdNotifications, MdSettings, MdBook, MdAssignment } from 'react-icons/md';
import { FaGamepad } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const JournalPromptPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="journal-prompt-root">
            <main className="main-content">
                <div className="journal-header">
                    <h1>Hey Suraj ✨</h1>
                    <p>Start reflecting your ideas</p>
                </div>
                <div className="journal-filters">
                    {['Theme', 'Tone', 'Purpose', 'Target audience', 'Length/words', 'Complexity', 'Highlights', 'Keyword'].map(filter => (
                        <button key={filter} className="filter-button">{filter}</button>
                    ))}
                </div>
                <div className="journal-grid">
                    <div className="journal-card">
                        <h3>Write Journal prompt</h3>
                        <p>Lorem ipsum is a dummy or placeholder text commonly used in graphic design, publishing, and web development.</p>
                    </div>
                    <div className="journal-card">
                        <h3>Full journal as per prompt</h3>
                        <p>Lorem ipsum is a dummy or placeholder text commonly used in graphic design, publishing, and web development.</p>
                    </div>
                    <div className="journal-card">
                        <h3>Write Journal prompt</h3>
                        <p>Lorem ipsum is a dummy or placeholder text commonly used in graphic design, publishing, and web development.</p>
                    </div>
                    <div className="journal-card">
                        <h3>Full journal as per prompt</h3>
                        <p>Lorem ipsum is a dummy or placeholder text commonly used in graphic design, publishing, and web development.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default JournalPromptPage;