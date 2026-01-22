import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { sendAction } from '../../api/client';
import { PremiumButton, PremiumText } from '../../components/shared/PremiumComponents';
import { Globe, ChevronRight, Sparkles, Send, Map, Users, History, User, Zap, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumGameLayout } from '../PremiumGameLayout';

export const WorldBuildersView = () => {
    const { gameState, sessionId, userId, updateGameState, gameSlug } = useGame();
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    if (!gameState) return null;

    const round = gameState.round || "Geography";
    const codex = gameState.world_codex || [];
    const narrative = gameState.last_ai_response?.narrative || "The world is unformed. What lands shall we shape?";
    const nextPrompt = gameState.last_ai_response?.next_prompt || "Specify the next element of this world.";

    // New Stats
    const mana = gameState.mana ?? 100;
    const population = gameState.population ?? 0;
    const stability = gameState.stability ?? 100;

    const categoryIcons: { [key: string]: React.ElementType } = {
        'Geography': Map,
        'Culture': Users,
        'History': History,
        'Character': User
    };

    const handleSubmit = async (action: string, content: string) => {
        if (!sessionId || !gameSlug) return;
        setLoading(true);
        try {
            const resp = await sendAction(gameSlug, sessionId, userId, action, content);
            if (resp.ok) updateGameState(resp.state);
        } catch (e) { console.error(e); }
        setLoading(false);
        setInput("");
    };

    return (
        <PremiumGameLayout
            title="World Builders"
            subtitle={`Epoch: ${round}`}
            icon={Globe}
            backgroundVar="starfield"
            guideText="1. Shape the world together by defining Geography, Culture, and History.\n2. In each epoch, describe a new element.\n3. Your power is finite (Mana) and your world is fragile (Stability).\n4. Use 'Skip Age' to move to the next phase."
        >
            <div className="flex flex-col h-full gap-6">

                {/* Stats Header Bar */}
                <div className="grid grid-cols-3 gap-4 mb-2">
                    <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/5 p-4 flex items-center justify-between group overflow-hidden relative">
                        <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
                        <div className="relative z-10">
                            <div className="text-[10px] font-black tracking-widest text-blue-400 uppercase mb-1">Mana</div>
                            <div className="text-xl font-black">{mana}</div>
                        </div>
                        <Zap className="relative z-10 text-blue-500/30 group-hover:text-blue-500 transition-colors" size={24} />
                    </div>
                    <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/5 p-4 flex items-center justify-between group overflow-hidden relative">
                        <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors" />
                        <div className="relative z-10">
                            <div className="text-[10px] font-black tracking-widest text-emerald-400 uppercase mb-1">LIVES</div>
                            <div className="text-xl font-black">{population.toLocaleString()}</div>
                        </div>
                        <Users className="relative z-10 text-emerald-500/30 group-hover:text-emerald-500 transition-colors" size={24} />
                    </div>
                    <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/5 p-4 flex items-center justify-between group overflow-hidden relative">
                        <div className="absolute inset-0 bg-rose-500/5 group-hover:bg-rose-500/10 transition-colors" />
                        <div className="relative z-10">
                            <div className="text-[10px] font-black tracking-widest text-rose-400 uppercase mb-1">STABILITY</div>
                            <div className="text-xl font-black">{stability}%</div>
                        </div>
                        <Activity className="relative z-10 text-rose-500/30 group-hover:text-rose-500 transition-colors" size={24} />
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">

                    {/* Left/Middle: Lore & Narrative (3/4) */}
                    <div className="lg:col-span-3 flex flex-col gap-6 overflow-hidden">
                        <div className="flex-1 bg-black/40 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col shadow-2xl">
                            {/* Ambient World Glow */}
                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent transition-all duration-1000`}
                                style={{ opacity: stability / 100 }} />

                            <div className="relative z-10 flex-1 flex flex-col p-8 md:p-14 overflow-y-auto custom-scrollbar">
                                <motion.div
                                    key={round}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mb-8"
                                >
                                    <span className="px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] text-orange-500 font-black uppercase tracking-[0.3em] mb-4 inline-block">
                                        EPOCH OF {round}
                                    </span>
                                </motion.div>

                                <div className="flex-1 flex flex-col justify-center">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={narrative.substring(0, 30)}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -15 }}
                                            transition={{ duration: 1 }}
                                            className="text-2xl md:text-5xl font-light text-white leading-tight font-serif italic"
                                        >
                                            <PremiumText text={narrative} />
                                        </motion.div>
                                    </AnimatePresence>

                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.6 }}
                                        className="mt-16 text-lg text-orange-400 font-bold tracking-widest flex items-center gap-3"
                                    >
                                        <ChevronRight size={20} className="animate-pulse" />
                                        {nextPrompt}
                                    </motion.p>
                                </div>
                            </div>
                        </div>

                        {/* Input System */}
                        <div className="bg-black/60 p-2 rounded-[2rem] border-2 border-white/5 shadow-2xl backdrop-blur-3xl flex items-center gap-4 group">
                            <div className="flex-1 relative">
                                <Map className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 group-focus-within:text-orange-500 transition-colors" />
                                <input
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSubmit('create', input)}
                                    placeholder={`Shape the world...`}
                                    disabled={loading}
                                    className="w-full bg-transparent border-none text-white placeholder-white/10 py-6 pl-16 pr-8 focus:outline-none text-xl font-serif"
                                />
                            </div>
                            <PremiumButton
                                onClick={() => handleSubmit('create', input)}
                                disabled={loading || !input}
                                className="h-[70px] aspect-square rounded-[1.5rem] bg-orange-600 hover:bg-orange-500 shadow-xl shadow-orange-950/20"
                            >
                                {loading ? <Sparkles className="animate-spin" /> : <Send size={24} />}
                            </PremiumButton>
                            <button
                                onClick={() => handleSubmit('advance_round', 'skip')}
                                className="h-[70px] px-8 rounded-[1.5rem] text-white/30 hover:text-white hover:bg-white/5 transition-all text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2"
                            >
                                Skip Age
                            </button>
                        </div>
                    </div>

                    {/* Right: The Codex (1/4) */}
                    <div className="lg:col-span-1 bg-black/50 rounded-[2.5rem] border border-white/5 flex flex-col overflow-hidden shadow-2xl backdrop-blur-2xl">
                        <div className="p-8 bg-white/5 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3 text-white">
                                <Globe size={20} className="text-orange-500" />
                                <h3 className="font-black uppercase tracking-widest text-xs">Genesis Codex</h3>
                            </div>
                            <span className="text-[10px] text-white/20 font-black">{codex.length}</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            <AnimatePresence>
                                {codex.length === 0 ? (
                                    <div className="text-center py-20 opacity-5">
                                        <Map size={64} className="mx-auto" />
                                    </div>
                                ) : (
                                    codex.map((entry: { type: string, title: string, description: string }, i: number) => {
                                        const Icon = categoryIcons[entry.type] || Map;
                                        return (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="bg-white/5 border border-white/5 rounded-2xl p-5 hover:bg-white/10 transition-all group"
                                            >
                                                <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-2">
                                                    <Icon size={12} className="text-orange-500" />
                                                    <h4 className="text-xs font-black uppercase tracking-widest text-white/80">{entry.title}</h4>
                                                </div>
                                                <p className="text-xs text-white/50 leading-relaxed font-serif italic">
                                                    {entry.description}
                                                </p>
                                            </motion.div>
                                        );
                                    })
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </PremiumGameLayout>
    );
};


