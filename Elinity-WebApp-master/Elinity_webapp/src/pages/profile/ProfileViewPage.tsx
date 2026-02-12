import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { MdEdit, MdLocationOn, MdWork, MdSchool, MdCake, MdFavorite } from 'react-icons/md';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { profileApi } from '../../api/profile';
import './ProfileViewPage.css';

const ProfileViewPage: React.FC = () => {
    const navigate = useNavigate();

    const { data: user, isLoading } = useQuery({
        queryKey: ['profile', 'me'],
        queryFn: profileApi.getMe,
    });

    if (isLoading) {
        return (
            <div className="profile-view-root">
                <Sidebar />
                <main className="profile-view-main">
                    <Topbar />
                    <div className="profile-loading">Loading profile...</div>
                </main>
            </div>
        );
    }

    const personalInfo = user?.personal_info;
    const bigFive = user?.big_five_traits;
    const mbti = user?.mbti_traits;
    const interests = user?.interests_and_hobbies;
    const values = user?.values_beliefs_and_goals;
    const favorites = user?.favorites;

    return (
        <div className="profile-view-root">
            <Sidebar />

            <main className="profile-view-main">
                <Topbar />

                <div className="profile-view-content">
                    {/* Header */}
                    <div className="profile-header">
                        <div className="profile-header-content">
                            <div className="profile-avatar-large">
                                {user?.full_name?.[0] || 'U'}
                            </div>
                            <div className="profile-header-info">
                                <h1>{user?.full_name || 'Anonymous User'}</h1>
                                {personalInfo?.bio && <p className="profile-bio">{personalInfo.bio}</p>}
                                <div className="profile-meta">
                                    {personalInfo?.age && (
                                        <div className="meta-item">
                                            <MdCake />
                                            <span>{personalInfo.age} years old</span>
                                        </div>
                                    )}
                                    {personalInfo?.location && (
                                        <div className="meta-item">
                                            <MdLocationOn />
                                            <span>{personalInfo.location}</span>
                                        </div>
                                    )}
                                    {personalInfo?.occupation && (
                                        <div className="meta-item">
                                            <MdWork />
                                            <span>{personalInfo.occupation}</span>
                                        </div>
                                    )}
                                    {personalInfo?.education && (
                                        <div className="meta-item">
                                            <MdSchool />
                                            <span>{personalInfo.education}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="primary"
                            leftIcon={<MdEdit />}
                            onClick={() => navigate('/edit-profile')}
                        >
                            Edit Profile
                        </Button>
                    </div>

                    {/* Profile Sections Grid */}
                    <div className="profile-sections">
                        {/* Personality - Big Five */}
                        {bigFive && (
                            <Card variant="glass" className="profile-section">
                                <h2 className="section-title">🧠 Personality Traits</h2>
                                <div className="traits-grid">
                                    {Object.entries(bigFive).map(([trait, value]) => (
                                        <div key={trait} className="trait-item">
                                            <div className="trait-label">{trait.replace('_', ' ')}</div>
                                            <div className="trait-bar">
                                                <div
                                                    className="trait-fill"
                                                    style={{ width: `${(value as number) * 100}%` }}
                                                />
                                            </div>
                                            <div className="trait-value">{Math.round((value as number) * 100)}%</div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* MBTI */}
                        {mbti?.type && (
                            <Card variant="glass" className="profile-section">
                                <h2 className="section-title">🎭 MBTI Type</h2>
                                <div className="mbti-display">
                                    <div className="mbti-type">{mbti.type}</div>
                                    {mbti.description && <p>{mbti.description}</p>}
                                </div>
                            </Card>
                        )}

                        {/* Interests & Hobbies */}
                        {interests && (
                            <Card variant="glass" className="profile-section">
                                <h2 className="section-title">🎨 Interests & Hobbies</h2>
                                <div className="tags-section">
                                    {interests.interests && interests.interests.length > 0 && (
                                        <div className="tag-group">
                                            <h4>Interests</h4>
                                            <div className="tags">
                                                {interests.interests.map((item, idx) => (
                                                    <span key={idx} className="tag">{item}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {interests.hobbies && interests.hobbies.length > 0 && (
                                        <div className="tag-group">
                                            <h4>Hobbies</h4>
                                            <div className="tags">
                                                {interests.hobbies.map((item, idx) => (
                                                    <span key={idx} className="tag">{item}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {interests.passions && interests.passions.length > 0 && (
                                        <div className="tag-group">
                                            <h4>Passions</h4>
                                            <div className="tags">
                                                {interests.passions.map((item, idx) => (
                                                    <span key={idx} className="tag tag-passion">{item}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}

                        {/* Values & Goals */}
                        {values && (
                            <Card variant="glass" className="profile-section">
                                <h2 className="section-title">⭐ Values & Goals</h2>
                                <div className="values-grid">
                                    {values.core_values && values.core_values.length > 0 && (
                                        <div className="value-group">
                                            <h4>Core Values</h4>
                                            <ul>
                                                {values.core_values.map((value, idx) => (
                                                    <li key={idx}>{value}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {values.life_goals && values.life_goals.length > 0 && (
                                        <div className="value-group">
                                            <h4>Life Goals</h4>
                                            <ul>
                                                {values.life_goals.map((goal, idx) => (
                                                    <li key={idx}>{goal}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}

                        {/* Favorites */}
                        {favorites && (
                            <Card variant="glass" className="profile-section">
                                <h2 className="section-title">❤️ Favorites</h2>
                                <div className="favorites-grid">
                                    {favorites.movies && favorites.movies.length > 0 && (
                                        <div className="favorite-item">
                                            <h4>🎬 Movies</h4>
                                            <p>{favorites.movies.join(', ')}</p>
                                        </div>
                                    )}
                                    {favorites.music && favorites.music.length > 0 && (
                                        <div className="favorite-item">
                                            <h4>🎵 Music</h4>
                                            <p>{favorites.music.join(', ')}</p>
                                        </div>
                                    )}
                                    {favorites.books && favorites.books.length > 0 && (
                                        <div className="favorite-item">
                                            <h4>📚 Books</h4>
                                            <p>{favorites.books.join(', ')}</p>
                                        </div>
                                    )}
                                    {favorites.food && favorites.food.length > 0 && (
                                        <div className="favorite-item">
                                            <h4>🍕 Food</h4>
                                            <p>{favorites.food.join(', ')}</p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfileViewPage;
