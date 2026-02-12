import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdPsychology, MdAutoAwesome, MdHistory, MdPerson, MdArrowForward, MdInfo } from 'react-icons/md';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import './AIModesPage.css';

const AIModesPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const categories = [
        { id: 'all', label: 'All Modes' },
        { id: 'guided', label: 'Guided Growth' },
        { id: 'cognitive', label: 'Cognitive' },
        { id: 'personas', label: 'AI Personas' },
        { id: 'historical', label: 'Historical Figures' },
    ];

    const modes = [
        { id: 'podcast', title: 'AI Podcast', category: 'guided', icon: <MdAutoAwesome />, desc: 'Deep dive into topics with Lumi' },
        { id: 'meditation', title: 'Guided Meditation', category: 'guided', icon: <MdAutoAwesome />, desc: 'Find your inner peace' },
        { id: 'deep_thinking', title: 'Deep Thinking', category: 'guided', icon: <MdAutoAwesome />, desc: 'Explore complex ideas' },
        { id: 'visualization', title: 'Visualization', category: 'guided', icon: <MdAutoAwesome />, desc: 'Manifest your future' },
        { id: 'metacognition', title: 'Metacognition', category: 'guided', icon: <MdAutoAwesome />, desc: 'Think about your thinking' },
        { id: 'mindfulness', title: 'Mindfulness', category: 'guided', icon: <MdAutoAwesome />, desc: 'Be present in the moment' },

        { id: 'socratic', title: 'Socratic Method', category: 'cognitive', icon: <MdHistory />, desc: 'Challenge your assumptions' },
        { id: 'learning', title: 'Learning Accelerator', category: 'cognitive', icon: <MdHistory />, desc: 'Master any subject' },
        { id: 'reality_check', title: 'Reality Check', category: 'cognitive', icon: <MdHistory />, desc: 'An objective perspective' },

        { id: 'tough_love', title: 'Tough Love', category: 'personas', icon: <MdPerson />, desc: 'The wake-up call you need' },
        { id: 'empathetic', title: 'Empathetic Therapist', category: 'personas', icon: <MdPerson />, desc: 'Kind and supportive guidance' },
        { id: 'sassy', title: 'Sassy Bestie', category: 'personas', icon: <MdPerson />, desc: 'Real talk with a bit of spice' },
        { id: 'wise_elder', title: 'Wise Elder', category: 'personas', icon: <MdPerson />, desc: 'Ancient wisdom for modern life' },
        { id: 'hype', title: 'Hype Coach', category: 'personas', icon: <MdPerson />, desc: 'Boost your confidence' },
        { id: 'zen', title: 'Zen Master', category: 'personas', icon: <MdPerson />, desc: 'Serenity and enlightenment' },

        { id: 'socrates_historical', title: 'Socrates', category: 'historical', icon: <MdHistory />, desc: 'The father of Western philosophy' },
        { id: 'jung', title: 'Carl Jung', category: 'historical', icon: <MdHistory />, desc: 'Explore your psyche' },
        { id: 'nietzsche', title: 'Friedrich Nietzsche', category: 'historical', icon: <MdHistory />, desc: 'Become who you are' },
        { id: 'da_vinci', title: 'Leonardo da Vinci', category: 'historical', icon: <MdHistory />, desc: 'The ultimate polymath' },
        { id: 'musashi', title: 'Miyamoto Musashi', category: 'historical', icon: <MdHistory />, desc: 'Strategy and the Way' },
        { id: 'aurelius', title: 'Marcus Aurelius', category: 'historical', icon: <MdHistory />, desc: 'Stoic leadership' },
    ];

    const filteredModes = selectedCategory === 'all'
        ? modes
        : modes.filter(m => m.category === selectedCategory);

    return (
        <div className="ai-modes-page-content" style={{ padding: '24px' }}>
            <div className="ai-modes-header">
                <h1 className="ai-modes-title">🧠 AI Personas & Modes</h1>
                <p className="ai-modes-subtitle">
                    Switch Lumi's personality or engage in specialized cognitive modes
                </p>
            </div>

            <div className="category-filters">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat.id)}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            <div className="modes-grid">
                {filteredModes.map((mode) => (
                    <Card
                        key={mode.id}
                        variant="glass"
                        hoverable
                        className="mode-card"
                    >
                        <div className="mode-icon-container">
                            <div className="mode-icon">{mode.icon}</div>
                            <div className="mode-badge">{mode.category}</div>
                        </div>

                        <div className="mode-info">
                            <h3 className="mode-title">{mode.title}</h3>
                            <p className="mode-desc">{mode.desc}</p>
                        </div>

                        <Button
                            variant="primary"
                            fullWidth
                            rightIcon={<MdArrowForward />}
                            onClick={() => navigate(`/lumi?mode=${mode.id}`)}
                        >
                            Enter Mode
                        </Button>
                    </Card>
                ))}
            </div>

            <div className="ai-modes-footer">
                <Card variant="glass" className="info-box">
                    <MdInfo />
                    <p>Engaging in these modes uses advanced AI processing to provide deep insights tailored to the persona's unique perspective.</p>
                </Card>
            </div>
        </div>
    );
};

export default AIModesPage;
