import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { sendAction } from '../../api/client';
import { PremiumButton, PremiumText } from '../../components/shared/PremiumComponents';
import { Scroll, Map, Backpack, Sword, Compass, HeartPulse, Brain, Users, MapPin, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumGameLayout } from '../PremiumGameLayout';

export const LongQuestView = () => {
    const { gameState, sessionId, userId, updateGameState, gameSlug } = useGame();
    const [loading, setLoading] = useState(false);

    if (!gameState) return null;

    const narrative = gameState.last_ai_response?.narrative || "The adventure begins. The road ahead is long, but glory awaits.";
    const questLog = gameState.quest_log || [];
    const options = gameState.last_ai_response?.options || [];
    const visual = gameState.last_ai_response?.visual_cue || "Uncharted Lands";

    // Stats
    const fort = gameState.fortitude ?? 100;
    const wiz = gameState.wisdom ?? 10;
    const cam = gameState.camaraderie ?? 50;

    const handleAction = async (act: string) => {
        if (!sessionId || !gameSlug) return;
        setLoading(true);
        try {
            const resp = await sendAction(gameSlug, sessionId, userId, 'action', act);
            if (resp.ok) updateGameState(resp.state);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    return (
        <PremiumGameLayout
            title="The Long Quest"
            subtitle="An Epic Odyssey"
            icon={Map}
            backgroundVar="void"
            guideText="1. Lead your party through a persistent, consequential world.\n2. Fortitude: Party health and stamina.\n3. Wisdom: Knowledge of the realm's secrets.\n4. Camaraderie: The bond that keeps the party from fracturing."
        >
            <div className="flex flex-col h-full gap-8 p-4 md:p-8 max-w-7xl mx-auto">

                {/* Party Status Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 bg-black/40 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10 shadow-3xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-rose-500/10 rounded-full text-rose-500 border border-rose-500/20"><HeartPulse size={20} /></div>
                        <div className="flex-1 space-y-1">
                            <div className="flex justify-between text-[10px] font-black tracking-widest text-rose-500 uppercase">Fortitude <span>{fort}%</span></div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <motion.div animate={{ width: `${fort}%` }} className="h-full bg-rose-500 shadow-[0_0_10px_#f43f5e]" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-500/10 rounded-full text-amber-500 border border-amber-500/20"><Brain size={20} /></div>
                        <div className="flex-1 space-y-1">
                            <div className="flex justify-between text-[10px] font-black tracking-widest text-amber-500 uppercase">Wisdom <span>{wiz}%</span></div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <motion.div animate={{ width: `${wiz}%` }} className="h-full bg-amber-500 shadow-[0_0_10px_#f59e0b]" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-500 border border-emerald-500/20"><Users size={20} /></div>
                        <div className="flex-1 space-y-1">
                            <div className="flex justify-between text-[10px] font-black tracking-widest text-emerald-500 uppercase">Camaraderie <span>{cam}%</span></div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <motion.div animate={{ width: `${cam}%` }} className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col lg:flex-row gap-8 min-h-0">

                    {/* Left: The Chronicler's Journal */}
                    <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0 h-full">
                        <div className="flex-1 bg-[#1a1410] border-t-2 border-amber-900/50 rounded-[2rem] p-8 flex flex-col shadow-inner relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5"><Scroll size={100} /></div>
                            <div className="flex items-center gap-2 mb-8 text-amber-900 font-black text-[10px] uppercase tracking-[0.4em]">
                                <Scroll size={14} /> Party Journal
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-hide">
                                {questLog.length === 0 && <p className="text-amber-900/30 text-xs italic font-serif">No entries yet...</p>}
                                {questLog.map((log: string, i: number) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-xs font-serif leading-relaxed text-amber-900/70 border-l border-amber-900/20 pl-4 py-1"
                                    >
                                        {log}
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Inventory Mock */}
                        <div className="grid grid-cols-3 gap-2 py-4 bg-black/20 rounded-2xl px-6 border border-white/5">
                            <div className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity"><Backpack size={16} /><span className="text-[7px] font-black tracking-widest">PACK</span></div>
                            <div className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity"><Sword size={16} /><span className="text-[7px] font-black tracking-widest">ARMS</span></div>
                            <div className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity"><Compass size={16} /><span className="text-[7px] font-black tracking-widest">MAP</span></div>
                        </div>
                    </div>

                    {/* Right: The World View */}
                    <div className="flex-1 flex flex-col gap-8">
                        {/* Location Visual Box */}
                        <div className="h-48 md:h-64 rounded-[3rem] bg-gradient-to-br from-[#2a1a10] to-black border border-white/10 relative overflow-hidden group shadow-3xl">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-40" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                            <div className="absolute bottom-8 left-10 flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-amber-500 text-[9px] font-black uppercase tracking-[0.4em] bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-amber-500/20 w-fit">
                                    <MapPin size={12} /> {visual}
                                </div>
                                <h3 className="text-3xl md:text-5xl font-serif text-white italic drop-shadow-2xl">The Path Ahead</h3>
                            </div>
                            <div className="absolute top-8 right-10 w-20 h-20 border border-white/5 rounded-full flex items-center justify-center animate-pulse">
                                <Search className="text-white/10" size={32} />
                            </div>
                        </div>

                        {/* Narrative Display */}
                        <div className="flex-1 bg-gradient-to-b from-white/10 to-transparent border border-white/5 p-10 md:p-14 rounded-[3rem] relative shadow-3xl overflow-hidden min-h-[300px] flex flex-col justify-center">
                            <div className="absolute top-0 right-0 p-4 font-serif text-[120px] text-white/[0.02] -rotate-12 pointer-events-none tracking-tighter">O</div>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={narrative.substring(0, 30)}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="relative z-10"
                                >
                                    <p className="text-2xl md:text-3xl lg:text-4xl text-white leading-snug font-serif italic">
                                        <PremiumText text={narrative} />
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Decision Hub */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {options.map((opt: string, i: number) => (
                                <motion.div key={i} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <PremiumButton
                                        variant="secondary"
                                        onClick={() => handleAction(opt)}
                                        disabled={loading}
                                        className="w-full text-left p-6 h-auto rounded-[1.5rem] !bg-amber-900/10 !border-amber-900/30 hover:!bg-amber-900/20 hover:!border-amber-500/50 group transition-all"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-serif italic text-amber-200 group-hover:text-white transition-colors capitalize">{opt}</span>
                                            <Sword size={16} className="text-amber-900 group-hover:text-amber-500 transition-colors" />
                                        </div>
                                    </PremiumButton>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </PremiumGameLayout>
    );
};

