import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
    MdSave, MdArrowBack, MdPerson, MdPsychology, MdFavorite, MdWork,
    MdStars, MdList, MdModeEdit, MdOutlineSentimentSatisfiedAlt,
    MdLoop, MdLightbulb, MdAutoAwesome
} from 'react-icons/md';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { profileApi } from '../../api/profile';
import type {
    User, PersonalInfo, BigFiveTraits, MBTITraits, Psychology, InterestsAndHobbies,
    ValuesBeliefsAndGoals, Favorites, RelationshipPreferences, FriendshipPreferences,
    CollaborationPreferences, Intentions, IdealCharacteristics, AspirationAndReflections,
    Lifestyle, PersonalFreeForm
} from '../../types/api';
import './EditProfilePage.css';

type Section =
    | 'personal' | 'bigfive' | 'mbti' | 'psychology' | 'interests'
    | 'values' | 'favorites' | 'relationship' | 'friendship'
    | 'collaboration' | 'intentions' | 'characteristics' | 'aspirations'
    | 'lifestyle' | 'freeform';

const EditProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [activeSection, setActiveSection] = useState<Section>('personal');
    const [isSaving, setIsSaving] = useState(false);

    const { data: user, isLoading } = useQuery({
        queryKey: ['user', 'me'],
        queryFn: profileApi.getMe,
    });

    // Form states
    const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({});
    const [bigFive, setBigFive] = useState<BigFiveTraits>({
        openness: 0.5, conscientiousness: 0.5, extraversion: 0.5, agreeableness: 0.5, neuroticism: 0.5
    });
    const [mbti, setMbti] = useState<MBTITraits>({
        introversion: 0.5, extraversion: 0.5, agreeableness: 0.5, neuroticism: 0.5
    });
    const [psychology, setPsychology] = useState<Psychology>({});
    const [interests, setInterests] = useState<InterestsAndHobbies>({ interests: [], hobbies: [] });
    const [values, setValues] = useState<ValuesBeliefsAndGoals>({ values: [], personal_goals: [], professional_goals: [], aspirations: [] });
    const [favorites, setFavorites] = useState<Favorites>({
        anecdotes: [], quotes: [], movies: [], music: [], art: [], books: [], poems: [], places: []
    });
    const [relationship, setRelationship] = useState<RelationshipPreferences>({
        looking_for: [], deal_breakers: [], red_flags: [], green_flags: [], what_i_offer: [], what_i_want: []
    });
    const [friendship, setFriendship] = useState<FriendshipPreferences>({ ideal_traits: [], activities: [] });
    const [collaboration, setCollaboration] = useState<CollaborationPreferences>({
        areas_of_expertise: [], achievements: [], ideal_collaborator_traits: [], goals: []
    });
    const [intentions, setIntentions] = useState<Intentions>({});
    const [characteristics, setCharacteristics] = useState<IdealCharacteristics>({
        passionate: 0, adventurous: 0, supportive: 0, funny: 0, reliable: 0, open_minded: 0, innovative: 0, dedicated: 0, ethical: 0
    });
    const [aspirations, setAspirations] = useState<AspirationAndReflections>({
        bucket_list: [], life_goals: [], greatest_regrets: [], greatest_fears: []
    });
    const [lifestyle, setLifestyle] = useState<Lifestyle>({});
    const [freeform, setFreeform] = useState<PersonalFreeForm>({});

    // Initialize form data
    useEffect(() => {
        if (user) {
            if (user.personal_info) setPersonalInfo(user.personal_info);
            if (user.big_five_traits) setBigFive(prev => ({ ...prev, ...user.big_five_traits }));
            if (user.mbti_traits) setMbti(prev => ({ ...prev, ...user.mbti_traits }));
            if (user.psychology) setPsychology(user.psychology);
            if (user.interests_and_hobbies) setInterests(user.interests_and_hobbies);
            if (user.values_beliefs_and_goals) setValues(user.values_beliefs_and_goals);
            if (user.favorites) setFavorites(user.favorites);
            if (user.relationship_preferences) setRelationship(user.relationship_preferences);
            if (user.friendship_preferences) setFriendship(user.friendship_preferences);
            if (user.collaboration_preferences) setCollaboration(user.collaboration_preferences);
            if (user.intentions) setIntentions(user.intentions);
            if (user.ideal_characteristics) setCharacteristics(prev => ({ ...prev, ...user.ideal_characteristics }));
            if (user.aspiration_and_reflections) setAspirations(user.aspiration_and_reflections);
            if (user.lifestyle) setLifestyle(user.lifestyle);
            if (user.personal_free_form) setFreeform(user.personal_free_form);
        }
    }, [user]);

    // Mutations
    const createMutation = (fn: (data: any) => Promise<any>) => useMutation({
        mutationFn: fn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
        },
    });

    const mutators = {
        personal: createMutation(profileApi.updatePersonalInfo),
        bigfive: createMutation(profileApi.updateBigFive),
        mbti: createMutation(profileApi.updateMBTI),
        psychology: createMutation(profileApi.updatePsychology),
        interests: createMutation(profileApi.updateInterests),
        values: createMutation(profileApi.updateValues),
        favorites: createMutation(profileApi.updateFavorites),
        relationship: createMutation(profileApi.updateRelationshipPreferences),
        friendship: createMutation(profileApi.updateFriendshipPreferences),
        collaboration: createMutation(profileApi.updateCollaborationPreferences),
        intentions: createMutation(profileApi.updateIntentions),
        characteristics: createMutation(profileApi.updateIdealCharacteristics),
        aspirations: createMutation(profileApi.updateAspirationAndReflections),
        lifestyle: createMutation(profileApi.updateLifestyle),
        freeform: createMutation(profileApi.updatePersonalFreeForm),
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const dataMap: Record<Section, any> = {
                personal: personalInfo,
                bigfive: bigFive,
                mbti: mbti,
                psychology: psychology,
                interests: interests,
                values: values,
                favorites: favorites,
                relationship: relationship,
                friendship: friendship,
                collaboration: collaboration,
                intentions: intentions,
                characteristics: characteristics,
                aspirations: aspirations,
                lifestyle: lifestyle,
                freeform: freeform,
            };
            await mutators[activeSection].mutateAsync(dataMap[activeSection]);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error saving profile section:', error);
            alert('Failed to save changes. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const sections = [
        { id: 'personal' as Section, label: 'Personal Info', icon: <MdPerson /> },
        { id: 'bigfive' as Section, label: 'Big Five Traits', icon: <MdPsychology /> },
        { id: 'mbti' as Section, label: 'MBTI Traits', icon: <MdStars /> },
        { id: 'psychology' as Section, label: 'Psychology', icon: <MdPsychology /> },
        { id: 'interests' as Section, label: 'Interests and Hobbies', icon: <MdFavorite /> },
        { id: 'values' as Section, label: 'Values, Beliefs and Goals', icon: <MdList /> },
        { id: 'favorites' as Section, label: 'Favorites', icon: <MdFavorite /> },
        { id: 'relationship' as Section, label: 'Relationship Preferences', icon: <MdFavorite /> },
        { id: 'friendship' as Section, label: 'Friendship Preferences', icon: <MdOutlineSentimentSatisfiedAlt /> },
        { id: 'collaboration' as Section, label: 'Collaboration Preferences', icon: <MdWork /> },
        { id: 'intentions' as Section, label: 'Intentions', icon: <MdLoop /> },
        { id: 'characteristics' as Section, label: 'Ideal Characteristics', icon: <MdLightbulb /> },
        { id: 'aspirations' as Section, label: 'Aspiration and Reflections', icon: <MdAutoAwesome /> },
        { id: 'lifestyle' as Section, label: 'Lifestyle', icon: <MdWork /> },
        { id: 'freeform' as Section, label: 'Personal Free Form', icon: <MdModeEdit /> },
    ];

    const handleArrayInput = (value: string, setter: React.Dispatch<React.SetStateAction<any>>, field: string) => {
        const items = value.split(',').map(item => item.trim()).filter(item => item);
        setter((prev: any) => ({ ...prev, [field]: items }));
    };

    if (isLoading) {
        return (
            <div className="edit-profile-loading">
                <div className="spinner"></div>
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="edit-profile-content">
            <div className="edit-profile-header">
                <Button variant="ghost" leftIcon={<MdArrowBack />} onClick={() => navigate('/profile')}>
                    Back to Profile
                </Button>
                <h1 className="edit-profile-title">Edit Profile</h1>
                <Button variant="primary" leftIcon={<MdSave />} onClick={handleSave} loading={isSaving}>
                    Save Changes
                </Button>
            </div>

            <div className="edit-profile-layout">
                <div className="section-nav">
                    {sections.map((s) => (
                        <button key={s.id} className={`section-nav-item ${activeSection === s.id ? 'active' : ''}`} onClick={() => setActiveSection(s.id)}>
                            {s.icon} <span>{s.label}</span>
                        </button>
                    ))}
                </div>

                <div className="section-content">
                    <Card variant="glass" className="edit-form-card">
                        {activeSection === 'personal' && (
                            <div className="form-section">
                                <h2>Personal Info</h2>

                                {/* Profile Picture Upload */}
                                <div style={{ marginBottom: '32px', padding: '24px', background: 'rgba(162, 89, 230, 0.05)', borderRadius: '16px', border: '1px solid rgba(162, 89, 230, 0.2)' }}>
                                    <h3 style={{ fontSize: '18px', marginBottom: '16px', color: 'var(--text-primary)' }}>Profile Picture</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                                        <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--primary)', flexShrink: 0 }}>
                                            {user?.profile_pictures?.[0]?.url ? (
                                                <img src={user.profile_pictures[0].url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', color: 'var(--text-tertiary)' }}>
                                                    {personalInfo.first_name?.[0] || '?'}
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ flex: 1, minWidth: '250px' }}>
                                            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                                                Upload a new profile picture or provide an image URL
                                            </p>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => navigate('/profile-picture-upload')}
                                            >
                                                Change Profile Picture
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <Input label="First Name" value={personalInfo.first_name || ''} onChange={(e) => setPersonalInfo({ ...personalInfo, first_name: e.target.value })} />
                                    <Input label="Last Name" value={personalInfo.last_name || ''} onChange={(e) => setPersonalInfo({ ...personalInfo, last_name: e.target.value })} />
                                </div>
                                <Input label="Location" value={personalInfo.location || ''} onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })} />
                                <Input label="Age" type="number" value={personalInfo.age || ''} onChange={(e) => setPersonalInfo({ ...personalInfo, age: parseInt(e.target.value) || 0 })} />
                                <Input label="Gender" value={personalInfo.gender || ''} onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })} />
                                <Input label="Sexual Orientation" value={personalInfo.sexual_orientation || ''} onChange={(e) => setPersonalInfo({ ...personalInfo, sexual_orientation: e.target.value })} />
                                <Input label="Occupation" value={personalInfo.occupation || ''} onChange={(e) => setPersonalInfo({ ...personalInfo, occupation: e.target.value })} />
                                <Input label="Education" value={personalInfo.education || ''} onChange={(e) => setPersonalInfo({ ...personalInfo, education: e.target.value })} />
                                <Input label="Relationship Status" value={personalInfo.relationship_status || ''} onChange={(e) => setPersonalInfo({ ...personalInfo, relationship_status: e.target.value })} />
                            </div>
                        )}

                        {activeSection === 'bigfive' && (
                            <div className="form-section">
                                <h2>Big Five Traits</h2>
                                <p className="section-description">Calibrate your core psychological spectrum.</p>
                                {Object.entries(bigFive).map(([trait, value]) => (
                                    <div key={trait} className="slider-input">
                                        <label>{trait.charAt(0).toUpperCase() + trait.slice(1)}</label>
                                        <div className="slider-container">
                                            <input type="range" min="0" max="1" step="0.01" value={value ?? 0.5} onChange={(e) => {
                                                const val = parseFloat(e.target.value);
                                                setBigFive(prev => ({ ...prev, [trait]: val }));
                                            }} />
                                            <span className="slider-value">{Math.round((value ?? 0.5) * 100)}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeSection === 'mbti' && (
                            <div className="form-section">
                                <h2>MBTI Traits</h2>
                                <p className="section-description">Tune your inner and outer energetic polarities.</p>
                                {Object.entries(mbti).map(([trait, value]) => (
                                    <div key={trait} className="slider-input">
                                        <label>{trait.charAt(0).toUpperCase() + trait.slice(1)}</label>
                                        <div className="slider-container">
                                            <input type="range" min="0" max="1" step="0.01" value={value ?? 0.5} onChange={(e) => {
                                                const val = parseFloat(e.target.value);
                                                setMbti(prev => ({ ...prev, [trait]: val }));
                                            }} />
                                            <span className="slider-value">{Math.round((value ?? 0.5) * 100)}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeSection === 'psychology' && (
                            <div className="form-section">
                                <h2>Psychology</h2>
                                <Input label="Communication Style" value={psychology.communication_style || ''} onChange={(e) => setPsychology({ ...psychology, communication_style: e.target.value })} />
                                <Input label="Conflict Resolution Style" value={psychology.conflict_resolution_style || ''} onChange={(e) => setPsychology({ ...psychology, conflict_resolution_style: e.target.value })} />
                                <Input label="Attachment Style" value={psychology.attachment_style || ''} onChange={(e) => setPsychology({ ...psychology, attachment_style: e.target.value })} />
                                <Input label="Stress Tolerance" value={psychology.stress_tolerance || ''} onChange={(e) => setPsychology({ ...psychology, stress_tolerance: e.target.value })} />
                                <Input label="Cognitive Style" value={psychology.cognitive_style || ''} onChange={(e) => setPsychology({ ...psychology, cognitive_style: e.target.value })} />
                            </div>
                        )}

                        {activeSection === 'interests' && (
                            <div className="form-section">
                                <h2>Interests and Hobbies</h2>
                                <Input label="Interests" value={interests.interests?.join(', ') || ''} onChange={(e) => handleArrayInput(e.target.value, setInterests, 'interests')} placeholder="e.g. AI, Quantum Physics, Jazz" />
                                <Input label="Hobbies" value={interests.hobbies?.join(', ') || ''} onChange={(e) => handleArrayInput(e.target.value, setInterests, 'hobbies')} placeholder="e.g. Archery, Solo Travel" />
                            </div>
                        )}

                        {activeSection === 'values' && (
                            <div className="form-section">
                                <h2>Values, Beliefs and Goals</h2>
                                <Input label="Values" value={values.values?.join(', ') || ''} onChange={(e) => handleArrayInput(e.target.value, setValues, 'values')} />
                                <Input label="Beliefs" value={values.beliefs || ''} onChange={(e) => setValues({ ...values, beliefs: e.target.value })} />
                                <Input label="Personal Goals" value={values.personal_goals?.join(', ') || ''} onChange={(e) => handleArrayInput(e.target.value, setValues, 'personal_goals')} />
                                <Input label="Professional Goals" value={values.professional_goals?.join(', ') || ''} onChange={(e) => handleArrayInput(e.target.value, setValues, 'professional_goals')} />
                            </div>
                        )}

                        {activeSection === 'favorites' && (
                            <div className="form-section">
                                <h2>Favorites</h2>
                                <Input label="Quotes" value={favorites.quotes?.join(', ') || ''} onChange={(e) => handleArrayInput(e.target.value, setFavorites, 'quotes')} />
                                <Input label="Movies" value={favorites.movies?.join(', ') || ''} onChange={(e) => handleArrayInput(e.target.value, setFavorites, 'movies')} />
                                <Input label="Music" value={favorites.music?.join(', ') || ''} onChange={(e) => handleArrayInput(e.target.value, setFavorites, 'music')} />
                                <Input label="Books" value={favorites.books?.join(', ') || ''} onChange={(e) => handleArrayInput(e.target.value, setFavorites, 'books')} />
                                <Input label="Places" value={favorites.places?.join(', ') || ''} onChange={(e) => handleArrayInput(e.target.value, setFavorites, 'places')} />
                            </div>
                        )}

                        {activeSection === 'relationship' && (
                            <div className="form-section">
                                <h2>Relationship Preferences</h2>
                                <Input label="Seeking" value={relationship.seeking || ''} onChange={(e) => setRelationship({ ...relationship, seeking: e.target.value })} />
                                <Input label="Looking For" value={relationship.looking_for?.join(', ') || ''} onChange={(e) => handleArrayInput(e.target.value, setRelationship, 'looking_for')} />
                                <Input label="Relationship Goals" value={relationship.relationship_goals || ''} onChange={(e) => setRelationship({ ...relationship, relationship_goals: e.target.value })} />
                                <Input label="Deal Breakers" value={relationship.deal_breakers?.join(', ') || ''} onChange={(e) => handleArrayInput(e.target.value, setRelationship, 'deal_breakers')} />
                                <Input label="What I Offer" value={relationship.what_i_offer?.join(', ') || ''} onChange={(e) => handleArrayInput(e.target.value, setRelationship, 'what_i_offer')} />
                                <Input label="What I Want" value={relationship.what_i_want?.join(', ') || ''} onChange={(e) => handleArrayInput(e.target.value, setRelationship, 'what_i_want')} />
                            </div>
                        )}

                        {activeSection === 'friendship' && (
                            <div className="form-section">
                                <h2>Friendship Preferences</h2>
                                <Input label="Seeking" value={friendship.seeking || ''} onChange={(e) => setFriendship({ ...friendship, seeking: e.target.value })} />
                                <Input label="Goals" value={friendship.goals || ''} onChange={(e) => setFriendship({ ...friendship, goals: e.target.value })} />
                                <Input label="Ideal Traits" value={friendship.ideal_traits?.join(', ') || ''} onChange={(e) => handleArrayInput(e.target.value, setFriendship, 'ideal_traits')} />
                                <Input label="Activities" value={friendship.activities?.join(', ') || ''} onChange={(e) => handleArrayInput(e.target.value, setFriendship, 'activities')} />
                            </div>
                        )}

                        {activeSection === 'collaboration' && (
                            <div className="form-section">
                                <h2>Collaboration Preferences</h2>
                                <Input label="Seeking" value={collaboration.seeking || ''} onChange={(e) => setCollaboration({ ...collaboration, seeking: e.target.value })} />
                                <Input label="Areas Of Expertise" value={collaboration.areas_of_expertise?.join(', ') || ''} onChange={(e) => handleArrayInput(e.target.value, setCollaboration, 'areas_of_expertise')} />
                                <Input label="Achievements" value={collaboration.achievements?.join(', ') || ''} onChange={(e) => handleArrayInput(e.target.value, setCollaboration, 'achievements')} />
                                <Input label="Ideal Collaborator Traits" value={collaboration.ideal_collaborator_traits?.join(', ') || ''} onChange={(e) => handleArrayInput(e.target.value, setCollaboration, 'ideal_collaborator_traits')} />
                                <Input label="Goals" value={collaboration.goals?.join(', ') || ''} onChange={(e) => handleArrayInput(e.target.value, setCollaboration, 'goals')} />
                            </div>
                        )}

                        {activeSection === 'intentions' && (
                            <div className="form-section">
                                <h2>Intentions</h2>
                                <Input label="Romantic" value={intentions.romantic || ''} onChange={(e) => setIntentions({ ...intentions, romantic: e.target.value })} />
                                <Input label="Social" value={intentions.social || ''} onChange={(e) => setIntentions({ ...intentions, social: e.target.value })} />
                                <Input label="Professional" value={intentions.professional || ''} onChange={(e) => setIntentions({ ...intentions, professional: e.target.value })} />
                            </div>
                        )}

                        {activeSection === 'characteristics' && (
                            <div className="form-section">
                                <h2>Ideal Characteristics</h2>
                                <p className="section-description">Tune the specific traits you value in your collective web.</p>
                                {Object.entries(characteristics).map(([trait, value]) => (
                                    <div key={trait} className="slider-input">
                                        <label>{trait.charAt(0).toUpperCase() + trait.slice(1)}</label>
                                        <div className="slider-container">
                                            <input type="range" min="0" max="1" step="0.01" value={value ?? 0} onChange={(e) => {
                                                const val = parseFloat(e.target.value);
                                                setCharacteristics(prev => ({ ...prev, [trait]: val }));
                                            }} />
                                            <span className="slider-value">{Math.round((value ?? 0) * 100)}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeSection === 'aspirations' && (
                            <div className="form-section">
                                <h2>Aspiration and Reflections</h2>
                                <Input label="Bucket List" value={aspirations.bucket_list?.join(', ') || ''} onChange={(e) => handleArrayInput(e.target.value, setAspirations, 'bucket_list')} />
                                <Input label="Life Goals" value={aspirations.life_goals?.join(', ') || ''} onChange={(e) => handleArrayInput(e.target.value, setAspirations, 'life_goals')} />
                                <Input label="Greatest Regrets" value={aspirations.greatest_regrets?.join(', ') || ''} onChange={(e) => handleArrayInput(e.target.value, setAspirations, 'greatest_regrets')} />
                                <Input label="Greatest Fears" value={aspirations.greatest_fears?.join(', ') || ''} onChange={(e) => handleArrayInput(e.target.value, setAspirations, 'greatest_fears')} />
                            </div>
                        )}

                        {activeSection === 'lifestyle' && (
                            <div className="form-section">
                                <h2>Lifestyle</h2>
                                <Input label="Ideal Day" value={lifestyle.ideal_day || ''} onChange={(e) => setLifestyle({ ...lifestyle, ideal_day: e.target.value })} />
                                <Input label="Ideal Week" value={lifestyle.ideal_week || ''} onChange={(e) => setLifestyle({ ...lifestyle, ideal_week: e.target.value })} />
                                <Input label="Ideal Weekend" value={lifestyle.ideal_weekend || ''} onChange={(e) => setLifestyle({ ...lifestyle, ideal_weekend: e.target.value })} />
                                <Input label="Lifestyle Rhythms" value={lifestyle.lifestyle_rhythms || ''} onChange={(e) => setLifestyle({ ...lifestyle, lifestyle_rhythms: e.target.value })} />
                            </div>
                        )}

                        {activeSection === 'freeform' && (
                            <div className="form-section">
                                <h2>Personal Free Form</h2>
                                <div className="input-field">
                                    <label>Share anything the system hasn't touched upon...</label>
                                    <textarea
                                        className="modern-textarea"
                                        value={freeform.things_to_share || ''}
                                        onChange={(e) => setFreeform({ things_to_share: e.target.value })}
                                        rows={10}
                                        placeholder="Let your essence flow here..."
                                    />
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default EditProfilePage;
