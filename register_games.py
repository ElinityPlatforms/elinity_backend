from sqlalchemy.orm import Session
from database.session import SessionLocal
from models.models import Game # Assuming Game model exists
import uuid

def register_suite_games():
    db = SessionLocal()
    
    # List of 58 Games from the suite
    suite_games = [
        {"name": "AI Adventure Dungeon", "slug": "elinity-ai-adventure-dungeon", "category": "Adventure"},
        {"name": "AI Comic Creator", "slug": "elinity-ai-comic-creator", "category": "Creative"},
        {"name": "AI Emoji War", "slug": "elinity-ai-emoji-war", "category": "Action"},
        {"name": "AI Escape Room", "slug": "elinity-ai-escape-room", "category": "Mystery"},
        {"name": "AI Fortune Teller", "slug": "elinity-ai-fortune-teller", "category": "Mystery"},
        {"name": "AI Improv Theater", "slug": "elinity-ai-improv-theater", "category": "Social"},
        {"name": "AI Poetry Garden", "slug": "elinity-ai-poetry-garden", "category": "Creative"},
        {"name": "AI Puzzle Architect", "slug": "elinity-ai-puzzle-architect", "category": "Puzzle"},
        {"name": "AI Puzzle Saga", "slug": "elinity-ai-puzzle-saga", "category": "Puzzle"},
        {"name": "AI Rap Battle", "slug": "elinity-ai-rap-battle", "category": "Music"},
        {"name": "AI Roast & Toast", "slug": "elinity-ai-roast-toast", "category": "Social"},
        {"name": "AI Role Swap", "slug": "elinity-ai-role-swap", "category": "Social"},
        {"name": "AI Sandbox", "slug": "elinity-ai-sandbox", "category": "Creative"},
        {"name": "Character Swap", "slug": "elinity-character-swap", "category": "Social"},
        {"name": "Collaborative Canvas", "slug": "elinity-collaborative-canvas", "category": "Creative"},
        {"name": "Connection Sparks", "slug": "elinity-connection-sparks", "category": "Social"},
        {"name": "Creative Duel Arena", "slug": "elinity-creative-duel-arena", "category": "Action"},
        {"name": "Cultural Exchange", "slug": "elinity-cultural-exchange", "category": "Social"},
        {"name": "Dream Battles", "slug": "elinity-dream-battles", "category": "Action"},
        {"name": "Dream Builder", "slug": "elinity-dream-builder", "category": "Creative"},
        {"name": "Emotion Charades", "slug": "elinity-emotion-charades", "category": "Social"},
        {"name": "Emotion Labyrinth", "slug": "elinity-emotion-labyrinth-node", "category": "Mystery"},
        {"name": "Epic Poem Duel", "slug": "elinity-epic-poem-duel", "category": "Creative"},
        {"name": "Friendship Towers", "slug": "elinity-friendship-towers", "category": "Social"},
        {"name": "Future Artifact Maker", "slug": "elinity-future-artifact-maker", "category": "Creative"},
        {"name": "Future Forecast", "slug": "elinity-future-forecast", "category": "Social"},
        {"name": "Gratitude Quest", "slug": "elinity-gratitude-quest", "category": "Wellbeing"},
        {"name": "Great Debate", "slug": "elinity-great-debate", "category": "Social"},
        {"name": "Guess The Fake", "slug": "elinity-guess-the-fake", "category": "Social"},
        {"name": "Hidden Truths", "slug": "elinity-hidden-truths", "category": "Social"},
        {"name": "Inner World Quest", "slug": "elinity-inner-world-quest", "category": "Wellbeing"},
        {"name": "Journey Journal", "slug": "elinity-journey-journal", "category": "Wellbeing"},
        {"name": "Journey Through Music", "slug": "elinity-journey-through-music", "category": "Music"},
        {"name": "Legacy Builder", "slug": "elinity-legacy-builder", "category": "Social"},
        {"name": "Life Goals Board Game", "slug": "elinity-life-goals-board-game", "category": "Wellbeing"},
        {"name": "Life Swap Simulator", "slug": "elinity-life-swap-simulator", "category": "Social"},
        {"name": "Meme Forge", "slug": "elinity-meme-forge", "category": "Creative"},
        {"name": "Micro Mysteries", "slug": "elinity-micro-mysteries", "category": "Mystery"},
        {"name": "Mind Meld", "slug": "elinity-mind-meld", "category": "Social"},
        {"name": "Mood DJ", "slug": "elinity-mood-dj", "category": "Music"},
        {"name": "Mood Journey", "slug": "elinity-mood-journey", "category": "Wellbeing"},
        {"name": "Mood Mosaic", "slug": "elinity-mood-mosaic", "category": "Creative"},
        {"name": "Myth Builder", "slug": "elinity-myth-builder", "category": "Creative"},
        {"name": "Mythic Beast Builder", "slug": "elinity-mythic-beast-builder", "category": "Creative"},
        {"name": "Relationship RPG", "slug": "elinity-relationship-rpg", "category": "Social"},
        {"name": "Serendipity Hunt", "slug": "elinity-serendipity-hunt", "category": "Social"},
        {"name": "Shared Playlist Maker", "slug": "elinity-shared-playlist-maker", "category": "Music"},
        {"name": "Social Labyrinth", "slug": "elinity-social-labyrinth", "category": "Social"},
        {"name": "Story Relay", "slug": "elinity-story-relay", "category": "Creative"},
        {"name": "Symbol Quest", "slug": "elinity-symbol-quest", "category": "Mystery"},
        {"name": "The AI Heist", "slug": "elinity-the-ai-heist", "category": "Mystery"},
        {"name": "The Alignment Game", "slug": "elinity-the-alignment-game", "category": "Social"},
        {"name": "The Hidden Question", "slug": "elinity-the-hidden-question", "category": "Social"},
        {"name": "The Long Journey", "slug": "elinity-the-long-journey", "category": "Adventure"},
        {"name": "Time Travelers", "slug": "elinity-time-travelers", "category": "Social"},
        {"name": "Truth Arcade", "slug": "elinity-truth-arcade", "category": "Action"},
        {"name": "Truth Timeline", "slug": "elinity-truth-timeline", "category": "Social"}
    ]

    try:
        from models.models import Game
        for g in suite_games:
            # Check if exists
            existing = db.query(Game).filter(Game.slug == g['slug']).first()
            if not existing:
                new_game = Game(
                    id=str(uuid.uuid4()),
                    name=g['name'],
                    slug=g['slug'],
                    desc=f"Explore the depth of {g['name']} in this AI-powered experience.",
                    category=g['category'],
                    tier='standard',
                    image=f"https://image.pollinations.ai/prompt/abstract%20game%20art%20{g['name'].replace(' ', '%20')}?nologo=true"
                )
                db.add(new_game)
        
        db.commit()
        print(f"SUCCESS: Registered {len(suite_games)} games in the database.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    register_suite_games()
