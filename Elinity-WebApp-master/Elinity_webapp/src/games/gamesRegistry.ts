export interface GameDef {
    title: string;
    desc: string;
    img: string;
    slug?: string; // If present, connects to backend at /games/{slug}
    routerPrefix?: string;
}

export const gamepadImg = 'https://openmoji.org/data/color/png/256/1F3AE.png';
export const crystalBallImg = 'https://openmoji.org/data/color/png/256/1F52E.png';
export const dungeonImg = 'https://openmoji.org/data/color/png/256/1F3F0.png';
export const arcadeImg = 'https://openmoji.org/data/color/png/256/1F479.png'; // Alien monster

export const games: GameDef[] = [
    {
        title: 'AI Adventure Dungeon',
        desc: 'Explore a procedurally generated dungeon, fight monsters, and gather loot in this text-based RPG.',
        img: dungeonImg,
        slug: 'ai-adventure-dungeon'
    },
    {
        title: 'Fortune Teller',
        desc: 'Seek guidance from the stars. Ask a question and receive your prophecy.',
        img: crystalBallImg,
        slug: 'ai-fortune-teller'
    },
    {
        title: 'Truth Arcade',
        desc: 'A truth-seeking arcade game powered by AI scenarios and dilemmas.',
        img: arcadeImg,
        slug: 'truth-arcade'
    },
    {
        title: 'Flirt or Fact',
        desc: 'Each person shares 3 statements. One is a real fact, one is a compliment/flirty line, and one is nonsense.',
        img: gamepadImg,
        // slug: 'flirt-or-fact' // Not yet confirmed in backend
    },
    {
        title: 'Rom Com',
        desc: 'Each player pitches a made-up romantic comedy based on your personalities',
        img: gamepadImg,
    },
    {
        title: 'The Tiny Turn-On Test',
        desc: 'AI gives subtle prompts like “What’s a tiny detail that instantly makes someone more attractive to you?”',
        img: gamepadImg,
    },
];
