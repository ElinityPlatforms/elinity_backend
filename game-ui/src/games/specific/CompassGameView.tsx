import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { sendAction } from '../../api/client';
import { PremiumButton, PremiumText } from '../../components/shared/PremiumComponents';
import { Compass, GitBranch, Navigation, Anchor, Wind, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumGameLayout } from '../PremiumGameLayout';

export const CompassGameView = () => {
    const { gameState, sessionId, userId, updateGameState, gameSlug } = useGame();
    const [loading, setLoading] = useState(false);

    if (!gameState) return null;

    const narrative = gameState.last_ai_response?.narrative || "The stars are silent. Where do we sail?";
    const location = gameState.last_ai_response?.location_name || "The Great Unknown";
    const insight = gameState.last_ai_response?.compass_insight;
    const choices = gameState.last_ai_response?.choices || [];

    // AXES: ns (Logic vs Emotion), ew (Self vs Others)
    const ns = gameState.north_south ?? 50;
    const ew = gameState.east_west ?? 50;

    const handleChoice = async (c: string) => {
        if (!sessionId || !gameSlug) return;
        setLoading(true);
        try {
            const resp = await sendAction(gameSlug, sessionId, userId, 'choose_path', c);
            if (resp.ok) updateGameState(resp.state);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    return (
        <PremiumGameLayout
            title="The Great Compass"
            subtitle="Cartography of the Soul"
            icon={Compass}
            backgroundVar="starfield"
            guideText="1. Navigate symbolic landscapes using your inherent values.\n2. North (Logic) vs South (Emotion).\n3. East (Individual) vs West (Collective).\n4. The Master Voyager maps your trajectory across the unseen seas."
        >
            <div className="flex flex-col h-full gap-8 relative p-4 md:p-8">

                {/* Location Reveal */}
                <div className="flex justify-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 bg-white/5 backdrop-blur-3xl px-8 py-3 rounded-full border border-white/10 shadow-2xl"
                    >
                        <Anchor size={14} className="text-cyan-400" />
                        <span className="text-xs font-black uppercase tracking-[0.4em] text-white/80">{location}</span>
                    </motion.div>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left: The Navigator (Compass) */}
                    <div className="relative flex flex-col items-center justify-center aspect-square max-w-md mx-auto group">
                        {/* Spinning Star Chart Rings */}
                        <div className="absolute inset-0 border border-white/5 rounded-full animate-[spin_120s_linear_infinite]" />
                        <div className="absolute inset-4 border border-white/5 rounded-full animate-[spin_90s_linear_infinite_reverse]" />
                        <div className="absolute inset-10 border border-white/10 rounded-full animate-[spin_60s_linear_infinite]" />

                        {/* Axis Labeling */}
                        <div className="absolute top-0 flex flex-col items-center text-cyan-400 opacity-50"><Wind size={16} /><span className="text-[8px] font-black mt-1">LOGIC</span></div>
                        <div className="absolute bottom-0 flex flex-col items-center text-rose-400 opacity-50"><Moon size={16} /><span className="text-[8px] font-black mt-1">EMOTION</span></div>
                        <div className="absolute left-0 flex flex-row items-center text-indigo-400 opacity-50"><span className="text-[8px] font-black mr-1 uppercase">Self</span><Anchor size={16} rotate={-90} /></div>
                        <div className="absolute right-0 flex flex-row items-center text-emerald-400 opacity-50"><Anchor size={16} rotate={90} /><span className="text-[8px] font-black ml-1 uppercase">Others</span></div>

                        {/* The Indicator Needle (Visualized as a soft glow point) */}
                        <motion.div
                            animate={{
                                x: (ew - 50) * 3,
                                y: (ns - 50) * -3
                            }}
                            className="relative z-20 w-3 h-3 bg-white rounded-full shadow-[0_0_20px_white] ring-4 ring-white/10"
                        >
                            <div className="absolute -inset-10 bg-white/5 rounded-full blur-xl" />
                        </motion.div>

                        <Compass className="absolute inset-0 text-white/5 p-20 animate-pulse" />
                    </div>

                    {/* Right: The Narrative & Insights */}
                    <div className="flex flex-col gap-10">
                        <div className="relative z-10">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={narrative.substring(0, 30)}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-black/60 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-white/10 shadow-3xl min-h-[250px] flex flex-col justify-center"
                                >
                                    <h2 className="text-[10px] font-black text-cyan-400 mb-6 uppercase tracking-[0.5em] flex items-center gap-2">
                                        <Navigation size={12} /> THE VOYAGE
                                    </h2>
                                    <div className="text-2xl md:text-3xl lg:text-4xl text-white leading-tight font-serif italic mb-8">
                                        <PremiumText text={narrative} />
                                    </div>

                                    {insight && (
                                        <div className="pt-6 border-t border-white/5">
                                            <div className="flex items-center gap-2 text-white/30 text-[9px] uppercase tracking-[0.3em] mb-2">APHORISM</div>
                                            <p className="text-gray-400 font-serif italic">"{insight}"</p>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Choice System */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {choices.map((c: string, i: number) => (
                                <motion.div key={i} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <PremiumButton
                                        variant="secondary"
                                        className="w-full text-left p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all flex items-center justify-between group"
                                        onClick={() => handleChoice(c)}
                                        disabled={loading}
                                    >
                                        <span className="text-xs font-black tracking-widest text-white/60 group-hover:text-white transition-colors">{c}</span>
                                        <GitBranch size={16} className="text-white/20 group-hover:text-cyan-400 transition-colors" />
                                    </PremiumButton>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Depth Meter */}
                <div className="flex justify-center gap-2 pb-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className={`h-1 rounded-full transition-all duration-1000 ${gameState.turn > i ? 'w-8 bg-cyan-500 shadow-[0_0_10px_#06b6d4]' : 'w-2 bg-white/10'}`} />
                    ))}
                </div>
            </div>
        </PremiumGameLayout>
    );
};

