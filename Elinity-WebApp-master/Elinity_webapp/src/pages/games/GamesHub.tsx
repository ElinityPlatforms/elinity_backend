import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { MdVideogameAsset, MdPeople, MdTimer, MdStar, MdPlayArrow } from 'react-icons/md';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { gamesApi } from '../../api/games';
import './GamesHub.css';

const GamesHub: React.FC = () => {
    const navigate = useNavigate();

    const { data: allGames, isLoading } = useQuery({
        queryKey: ['games', 'all'],
        queryFn: gamesApi.getAllGames,
    });

    const { data: myGames } = useQuery({
        queryKey: ['games', 'my-games'],
        queryFn: () => gamesApi.getMyGames(),
    });

    const gameCategories = [
        { name: 'All Games', filter: 'all' },
        { name: 'Quick Play', filter: 'quick' },
        { name: 'Deep Connection', filter: 'deep' },
        { name: 'Creative', filter: 'creative' },
        { name: 'Competitive', filter: 'competitive' },
    ];

    const [selectedCategory, setSelectedCategory] = React.useState('all');

    // Mock game data structure (will be replaced with real data from backend)
    const featuredGames = [
        {
            slug: 'value-compass',
            name: 'Value Compass',
            description: 'Discover shared values through moral dilemmas',
            category: 'Deep Connection',
            minPlayers: 2,
            maxPlayers: 4,
            duration: 15,
            tier: 'free',
            thumbnail: '🧭',
        },
        {
            slug: 'mood-journey',
            name: 'Mood Journey',
            description: 'Collaborative emotional exploration',
            category: 'Creative',
            minPlayers: 2,
            maxPlayers: 6,
            duration: 20,
            tier: 'free',
            thumbnail: '🎨',
        },
        {
            slug: 'truth-arcade',
            name: 'Truth Arcade',
            description: 'Fun truth or dare style questions',
            category: 'Quick Play',
            minPlayers: 2,
            maxPlayers: 8,
            duration: 10,
            tier: 'free',
            thumbnail: '🎯',
        },
        {
            slug: 'mind-meld',
            name: 'Mind Meld',
            description: 'Sync your thoughts and guess together',
            category: 'Competitive',
            minPlayers: 2,
            maxPlayers: 4,
            duration: 15,
            tier: 'premium',
            thumbnail: '🧠',
        },
        {
            slug: 'story-relay',
            name: 'Story Relay',
            description: 'Build a story together, one line at a time',
            category: 'Creative',
            minPlayers: 2,
            maxPlayers: 6,
            duration: 20,
            tier: 'free',
            thumbnail: '📖',
        },
        {
            slug: 'relationship-rpg',
            name: 'Relationship RPG',
            description: 'Navigate relationship scenarios together',
            category: 'Deep Connection',
            minPlayers: 2,
            maxPlayers: 2,
            duration: 30,
            tier: 'premium',
            thumbnail: '💑',
        },
    ];

    const handleCreateRoom = (gameSlug: string) => {
        // Redirect to the backend games dashboard as requested by the user
        window.location.href = 'http://136.113.118.172/auth/login';
    };

    return (
        <div className="games-hub-root">
            <Sidebar />

            <main className="games-hub-main">
                <Topbar />

                <div className="games-hub-content">
                    {/* Header */}
                    <div className="games-hub-header">
                        <div>
                            <h1 className="games-hub-title">🎮 Connection Games</h1>
                            <p className="games-hub-subtitle">
                                Play meaningful games that deepen your connections
                            </p>
                        </div>
                    </div>

                    {/* Active Games */}
                    {myGames && myGames.length > 0 && (
                        <div className="active-games-section">
                            <h2 className="section-title">Your Active Games</h2>
                            <div className="active-games-grid">
                                {myGames.map((game: any) => (
                                    <Card key={game.id} variant="glass" hoverable clickable>
                                        <div className="active-game-card">
                                            <div className="active-game-info">
                                                <h3>{game.game_slug}</h3>
                                                <p>{game.players?.length || 0} players</p>
                                            </div>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => window.location.href = 'http://136.113.118.172/auth/login'}
                                            >
                                                Continue
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Category Filter */}
                    <div className="category-filter">
                        {gameCategories.map((cat) => (
                            <button
                                key={cat.filter}
                                className={`category-btn ${selectedCategory === cat.filter ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat.filter)}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Featured Games Grid */}
                    <div className="games-grid">
                        {featuredGames.map((game) => (
                            <Card key={game.slug} variant="glass" hoverable className="game-card">
                                <div className="game-thumbnail">
                                    <div className="game-emoji">{game.thumbnail}</div>
                                    {game.tier === 'premium' && (
                                        <div className="premium-badge">
                                            <MdStar /> Premium
                                        </div>
                                    )}
                                </div>

                                <div className="game-content">
                                    <h3 className="game-title">{game.name}</h3>
                                    <p className="game-description">{game.description}</p>

                                    <div className="game-meta">
                                        <div className="game-meta-item">
                                            <MdPeople />
                                            <span>{game.minPlayers}-{game.maxPlayers} players</span>
                                        </div>
                                        <div className="game-meta-item">
                                            <MdTimer />
                                            <span>{game.duration} min</span>
                                        </div>
                                    </div>

                                    <div className="game-category-tag">{game.category}</div>
                                </div>

                                <div className="game-actions">
                                    <Button
                                        variant="primary"
                                        fullWidth
                                        leftIcon={<MdPlayArrow />}
                                        onClick={() => handleCreateRoom(game.slug)}
                                    >
                                        Play Now
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* How It Works */}
                    <Card variant="glass" className="how-it-works-card">
                        <h2 className="section-title">How It Works</h2>
                        <div className="how-it-works-grid">
                            <div className="how-it-works-step">
                                <div className="step-number">1</div>
                                <h4>Choose a Game</h4>
                                <p>Pick from our collection of connection-building games</p>
                            </div>
                            <div className="how-it-works-step">
                                <div className="step-number">2</div>
                                <h4>Create or Join</h4>
                                <p>Start a new game room or join an existing one</p>
                            </div>
                            <div className="how-it-works-step">
                                <div className="step-number">3</div>
                                <h4>Play Together</h4>
                                <p>Connect with others through meaningful gameplay</p>
                            </div>
                            <div className="how-it-works-step">
                                <div className="step-number">4</div>
                                <h4>Build Bonds</h4>
                                <p>Deepen your relationships through shared experiences</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default GamesHub;

