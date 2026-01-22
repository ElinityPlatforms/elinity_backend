import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { sendAction } from '../../api/client';
import { PremiumButton, PremiumText } from '../../components/shared/PremiumComponents';
import { Sword, Scroll, Send, Flame, Sparkles, BookOpen, Crown, Zap, Ghost } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumGameLayout } from '../PremiumGameLayout';

export const MythMakerView = () => {
    const { gameState, sessionId, userId, updateGameState, gameSlug } = useGame();
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    if (!gameState) return <div className="text-white text-center mt-20 font-black tracking-[0.5em] animate-pulse">AWAKENING DIVINITY...</div>;

    const mythNarrative = gameState.last_ai_response?.narrative || "The silence of the void awaits your first declaration.";
    const mythPanel = gameState.last_ai_response?.myth_panel || {};
    const stage = gameState.stage || 'Origins';
    const turn = gameState.turn || 1;

    // New Stats
    const belief = gameState.belief ?? 10;
    const divinity = gameState.divinity ?? 0;

    const panelTitle = mythPanel.title || "The Unwritten Word";
    const panelPoem = mythPanel.poem || "No verse has yet been sung of you.";

    const handleAction = async () => {
        if (!input.trim() || !sessionId) return;
        setLoading(true);
        try {
            const resp = await sendAction(gameSlug || 'myth-maker', sessionId, userId, 'action', input);
            if (resp.ok) {
                updateGameState(resp.state);
                setInput("");
            }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    return (
        <PremiumGameLayout
            title="Myth Maker Arena"
            subtitle={`Epoch: ${stage}`}
            icon={Crown}
            backgroundVar="starfield"
            guideText="1. Shape your legend through divine deeds.\n2. Belief flows from the world; Divinity flows from within.\n3. The Chronicler weaves your saga into the stars.\n4. Confront the trials of your own nature."
        >
            <div className="flex flex-col h-full gap-8 relative p-4 md:p-8 overflow-hidden">

                {/* Divine Status Header */}
                <div className="grid grid-cols-2 gap-8 bg-black/40 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/10 shadow-3xl relative z-10">
                    <div className="space-y-3">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.3em] text-amber-500">
                            <div className="flex items-center gap-2"><Flame size={12} /> World Belief</div>
                            <span>{belief}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div animate={{ width: `${belief}%` }} className="h-full bg-amber-500 shadow-[0_0_15px_#f59e0b]" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.3em] text-white">
                            <div className="flex items-center gap-2"><Zap size={12} /> Personal Divinity</div>
                            <span>{divinity}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div animate={{ width: `${divinity}%` }} className="h-full bg-gradient-to-r from-amber-200 to-white shadow-[0_0_15px_white]" />
                        </div>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/10 px-4 py-1 rounded-full border border-white/5 text-[8px] font-black tracking-widest text-white/40">
                        TURN {turn}
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
                    {/* The Chronicler's Voice - Main Scene */}
                    <div className="lg:col-span-2 flex flex-col h-full">
                        <div className="flex-1 bg-gradient-to-b from-black/60 to-black/20 rounded-[3rem] border border-white/5 relative overflow-hidden flex flex-col justify-center px-12 text-center group">
                            <div className="absolute top-0 right-0 p-20 text-white/[0.02] -rotate-12 pointer-events-none group-hover:text-amber-500/[0.05] transition-colors duration-1000">
                                <Sword size={400} />
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={mythNarrative.substring(0, 30)}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    className="relative z-10"
                                >
                                    <div className="text-[10px] font-black text-amber-500/40 mb-8 uppercase tracking-[0.5em]">The Eternal Saga</div>
                                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif italic text-white leading-tight drop-shadow-2xl">
                                        <PremiumText text={mythNarrative} />
                                    </h2>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* The Prophet's Scroll */}
                    <div className="lg:col-span-1 flex flex-col gap-8 h-full">
                        <div className="bg-[#1a1625] rounded-[2.5rem] border border-amber-500/10 p-10 flex-1 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden border-t-amber-500/30">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                            <BookOpen className="text-amber-500/20 mb-6" size={32} />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500/60 mb-8">{panelTitle}</h4>
                            <p className="text-xl italic font-serif text-gray-300 leading-relaxed whitespace-pre-wrap px-4">
                                "{panelPoem}"
                            </p>
                            <div className="absolute bottom-6 flex gap-2">
                                <Sparkles size={12} className="text-amber-500 animate-pulse" />
                                <Sparkles size={12} className="text-amber-500 animate-pulse delay-500" />
                            </div>
                        </div>

                        {/* Quick Status Info */}
                        <div className="bg-white/5 rounded-3xl p-6 flex flex-col gap-4 border border-white/5 backdrop-blur-3xl">
                            <div className="flex items-center gap-4 text-white/40">
                                <Ghost size={16} />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Current Resonance: High</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* The Divine Command Input */}
                <div className="relative z-20 mx-auto w-full max-w-4xl">
                    <div className="bg-white/5 backdrop-blur-[40px] border border-white/10 p-3 rounded-[3rem] flex items-center gap-4 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] focus-within:border-amber-500/30 transition-all">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-950/20">
                            <Scroll size={24} />
                        </div>
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAction()}
                            placeholder="Forge your immortal command..."
                            className="flex-1 bg-transparent border-none text-white placeholder:text-white/10 py-5 px-3 focus:outline-none font-serif text-2xl"
                            disabled={loading}
                        />
                        <PremiumButton
                            onClick={handleAction}
                            disabled={!input || loading}
                            className="h-14 px-12 rounded-full !bg-white !text-black hover:scale-105 transition-transform font-black text-[10px] tracking-widest shadow-2xl"
                        >
                            {loading ? <Flame className="animate-spin" size={16} /> : 'MANIFEST'}
                        </PremiumButton>
                    </div>
                </div>
            </div>
        </PremiumGameLayout>
    );
};

