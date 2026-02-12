import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { MdFavorite, MdSelfImprovement, MdGroups, MdArrowForward, MdSchool } from 'react-icons/md';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { skillsApi } from '../../api/skills';
import './SkillsPage.css';

const SkillsPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'relationship' | 'self-growth' | 'social'>('relationship');

    const { data: relationshipSkills, isLoading: isRelLoading } = useQuery({
        queryKey: ['skills', 'relationship'],
        queryFn: skillsApi.getRelationshipSkills,
    });

    const { data: selfGrowthSkills, isLoading: isSelfLoading } = useQuery({
        queryKey: ['skills', 'self-growth'],
        queryFn: skillsApi.getSelfGrowthSkills,
    });

    const { data: socialSkills, isLoading: isSocialLoading } = useQuery({
        queryKey: ['skills', 'social'],
        queryFn: skillsApi.getSocialSkills,
    });

    const tabs = [
        { id: 'relationship', label: 'Relationship', icon: <MdFavorite /> },
        { id: 'self-growth', label: 'Self Growth', icon: <MdSelfImprovement /> },
        { id: 'social', label: 'Social & Groups', icon: <MdGroups /> },
    ];

    const getActiveSkills = () => {
        switch (activeTab) {
            case 'relationship': return { data: relationshipSkills || [], loading: isRelLoading };
            case 'self-growth': return { data: selfGrowthSkills || [], loading: isSelfLoading };
            case 'social': return { data: socialSkills || [], loading: isSocialLoading };
            default: return { data: [], loading: false };
        }
    };

    const { data: skills, loading } = getActiveSkills();

    return (
        <div className="skills-page-content">
            <div className="skills-header">
                <div className="skills-header-text">
                    <h1 className="skills-title">🎓 AI Life Skills</h1>
                    <p className="skills-subtitle">
                        Level up your social intelligence, emotional maturity, and personal growth with AI coaching.
                    </p>
                </div>
            </div>

            <div className="skills-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`skill-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id as any)}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="skills-grid">
                {loading ? (
                    <div className="skills-loading">
                        <div className="spinner" />
                        <p>Loading skills...</p>
                    </div>
                ) : skills && skills.length > 0 ? (
                    skills.map((skill: any) => (
                        <Card
                            key={skill.id}
                            variant="glass"
                            hoverable
                            clickable
                            className="skill-card"
                            onClick={() => navigate(`/skills/${activeTab}/${skill.id}`)}
                        >
                            <div className="skill-card-icon">
                                <MdSchool />
                            </div>
                            <div className="skill-card-content">
                                <h3 className="skill-card-title">{skill.name}</h3>
                                <p className="skill-card-description">{skill.description}</p>
                                {skill.notes && <p className="skill-card-notes">Note: {skill.notes}</p>}
                            </div>
                            <div className="skill-card-arrow">
                                <MdArrowForward />
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="skills-empty">
                        <p>No skills available in this category yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SkillsPage;
