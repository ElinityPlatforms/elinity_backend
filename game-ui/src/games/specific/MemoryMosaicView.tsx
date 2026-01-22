import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { sendAction } from '../../api/client';
import { PremiumButton, PremiumText } from '../../components/shared/PremiumComponents';
import { Image, Sparkles, Plus, Ghost, Eye, Wind, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumGameLayout } from '../PremiumGameLayout';

export const MemoryMosaicView = () => {
    const { gameState, sessionId, userId, updateGameState, gameSlug } = useGame();
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    if (!gameState) return null;

    const theme = gameState.theme || "Collective Memories";
    const memories = gameState.memories || [];
    const narrative = gameState.last_ai_narrative || "The first shard has yet to be placed.";

    // New Stats
    const clarity = gameState.clarity ?? 10;
    const resonance = gameState.resonance ?? 50;

    const handleShare = async () => {
        if (!sessionId || !gameSlug || !input) return;
        setLoading(true);
        try {
            const resp = await sendAction(gameSlug, sessionId, userId, 'share_memory', input);
            if (resp.ok) updateGameState(resp.state);
        } catch (e) { console.error(e); }
        setLoading(false);
        setInput("");
    };

    return (
        <PremiumGameLayout
            title="Memory Mosaic"
            subtitle={theme}
            icon={Image}
            backgroundVar="starfield"
            guideText="1. Share a memory shard to help complete the mosaic.\n2. Clarity increases with detail; Resonance with harmony.\n3. The AI Master weaves these shards into a poetic whole.\n4. Together, we manifest the unseen past."
        >
            <div className="flex flex-col h-full gap-8 relative overflow-hidden p-4 md:p-8">

                {/* Stats Header */}
                <div className="flex gap-8 items-center bg-black/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5 relative z-10">
                    <div className="flex-1 flex flex-col gap-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">
                            <div className="flex items-center gap-2"><Eye size={12} /> Clarity</div>
                            <span>{clarity}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                animate={{ width: `${clarity}%` }}
                                className="h-full bg-cyan-500 shadow-[0_0_15px_#06b6d4]"
                            />
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-pink-400">
                            <div className="flex items-center gap-2"><Wind size={12} /> Resonance</div>
                            <span>{resonance}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                animate={{ width: `${resonance}%` }}
                                className="h-full bg-pink-500 shadow-[0_0_15px_#ec4899]"
                            />
                        </div>
                    </div>
                </div>

                {/* Narrative Synthesis */}
                <div className="relative text-center px-12 z-10">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={narrative.substring(0, 30)}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent italic font-serif text-xl md:text-3xl leading-relaxed drop-shadow-sm"
                        >
                            <PremiumText text={narrative} />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Mosaic Grid */}
                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar relative z-10 px-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                        <AnimatePresence mode='popLayout'>
                            {memories.map((mem: { text: string }, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30, rotateX: 10 }}
                                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="relative group perspective-1000"
                                >
                                    <div className="absolute -inset-0.5 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-[1px]" />
                                    <div className="relative bg-black/60 backdrop-blur-2xl border border-white/10 p-8 rounded-2xl h-full flex flex-col justify-center items-center text-center shadow-2xl transition-transform group-hover:-translate-y-2">
                                        <Ghost className="absolute top-4 left-4 text-white/5 group-hover:text-white/20 transition-colors" size={16} />
                                        <Sparkles className="absolute bottom-4 right-4 text-white/5 group-hover:text-cyan-500/20 transition-colors" size={16} />

                                        <p className="text-gray-100 italic font-serif text-lg leading-relaxed">
                                            "{mem.text}"
                                        </p>

                                        <div className="mt-6 pt-4 border-t border-white/5 w-full flex justify-between items-center text-[9px] font-black tracking-widest text-white/20">
                                            <span>SHARD #{i + 1}</span>
                                            <span>VAL: {((i * 7) % 20) + 1}RE</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Fixed Interaction Footer */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-8 z-30">
                    <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-3 rounded-[2.5rem] flex items-center gap-4 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-cyan-400 border border-white/5">
                            <Plus size={24} />
                        </div>
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleShare()}
                            placeholder="Manifest a new shard of memory..."
                            className="flex-1 bg-transparent border-none text-white placeholder:text-white/10 py-4 px-2 focus:outline-none font-serif text-xl"
                        />
                        <PremiumButton
                            onClick={handleShare}
                            disabled={loading || !input}
                            className="h-12 px-8 rounded-full bg-cyan-600 hover:bg-cyan-500 shadow-lg shadow-cyan-950/20 font-black text-[10px] tracking-widest"
                        >
                            {loading ? <Zap className="animate-spin" size={16} /> : 'MANIFEST'}
                        </PremiumButton>
                    </div>
                </div>
            </div>
        </PremiumGameLayout>
    );
};

