import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { sendAction } from '../../api/client';
import { PremiumButton, PremiumText } from '../../components/shared/PremiumComponents';
import { Scale, ShieldCheck, Skull, Zap, Gavel, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumGameLayout } from '../PremiumGameLayout';

export const AlignmentGameView = () => {
    const { gameState, sessionId, userId, updateGameState, gameSlug } = useGame();
    const [loading, setLoading] = useState(false);

    if (!gameState) return null;

    // AXES: law (0-100), good (0-100)
    const law = gameState.law ?? 50;
    const good = gameState.good ?? 50;
    const scenario = gameState.scenario || "The world remains in a state of ethical neutrality.";
    const analysis = gameState.analysis || "The Arbiter awaits your first judgment.";
    const dType = gameState.last_ai_response?.dilemma_type || "General Ethics";

    const handleChoice = async (choice: string) => {
        if (!sessionId || !gameSlug) return;
        setLoading(true);
        try {
            const resp = await sendAction(gameSlug, sessionId, userId, 'choice', choice);
            if (resp.ok) updateGameState(resp.state);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    return (
        <PremiumGameLayout
            title="Moral Alignment"
            subtitle={`School: ${dType}`}
            icon={Scale}
            backgroundVar="void"
            guideText="1. Face the Grand Arbiter and receive ethical trials.\n2. Law vs Chaos (Order/Structure vs Freedom/Anarchy).\n3. Good vs Evil (Altruism/Self-sacrifice vs Ego/Ambition).\n4. Every turn reveals a new facet of your true nature."
        >
            <div className="flex flex-col h-full gap-8 relative p-4 md:p-8">

                {/* Moral Compass Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center flex-1">

                    {/* Left: Visual Scales */}
                    <div className="flex flex-col gap-10">
                        <div className="bg-black/40 backdrop-blur-2xl border border-white/5 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                            <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-500/10 blur-[80px] rounded-full group-hover:bg-indigo-500/20 transition-all opacity-50" />
                            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gold/10 blur-[80px] rounded-full group-hover:bg-gold/20 transition-all opacity-50" />

                            <div className="text-center mb-12">
                                <Scale size={48} className="text-white/20 mx-auto mb-4" />
                                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Collective Soul Alignment</h3>
                            </div>

                            <div className="space-y-12">
                                {/* Law vs Chaos */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest px-2">
                                        <div className="flex items-center gap-2 text-rose-500"><Zap size={14} /> Chaos</div>
                                        <div className="flex items-center gap-2 text-cyan-500">Order <ShieldCheck size={14} /></div>
                                    </div>
                                    <div className="h-4 bg-white/5 rounded-full relative overflow-hidden ring-1 ring-white/5">
                                        <motion.div
                                            animate={{ width: `${law}%` }}
                                            className="absolute right-0 h-full bg-cyan-500 shadow-[0_0_20px_#06b6d4]"
                                        />
                                        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/20 z-10" />
                                    </div>
                                </div>

                                {/* Good vs Evil */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest px-2">
                                        <div className="flex items-center gap-2 text-gray-400"><Skull size={14} /> Abyss</div>
                                        <div className="flex items-center gap-2 text-yellow-500">Grace <Award size={14} /></div>
                                    </div>
                                    <div className="h-4 bg-white/5 rounded-full relative overflow-hidden ring-1 ring-white/5">
                                        <motion.div
                                            animate={{ width: `${good}%` }}
                                            className="absolute right-0 h-full bg-yellow-500 shadow-[0_0_20px_#eab308]"
                                        />
                                        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/20 z-10" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Analysis Box */}
                        <div className="bg-white/5 p-8 rounded-2xl border-l-[3px] border-indigo-500/50 backdrop-blur-md">
                            <div className="flex items-center gap-3 text-indigo-400 mb-4">
                                <Gavel size={18} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Judicial Analysis</span>
                            </div>
                            <p className="text-gray-400 font-serif italic text-lg leading-relaxed">
                                "{analysis}"
                            </p>
                        </div>
                    </div>

                    {/* Right: The Trial */}
                    <div className="flex flex-col gap-10">
                        <div className="relative">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={scenario.substring(0, 30)}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-black/40 backdrop-blur-3xl border border-white/10 p-10 rounded-[2rem] shadow-2xl"
                                >
                                    <h2 className="text-[10px] font-black text-rose-500 mb-6 uppercase tracking-[0.4em] flex items-center gap-2">
                                        <Zap size={12} className="animate-pulse" /> CURRENT TRIAL
                                    </h2>
                                    <div className="text-2xl md:text-3xl lg:text-4xl text-white leading-tight font-serif italic">
                                        <PremiumText text={scenario} />
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Choices Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { t: 'UPHOLD ORDER', v: 'law+' },
                                { t: 'EMBRACE CHAOS', v: 'law-' },
                                { t: 'ACT WITH GRACE', v: 'good+' },
                                { t: 'SERVE THE SELF', v: 'good-' }
                            ].map((c, i) => (
                                <PremiumButton
                                    key={i}
                                    variant="secondary"
                                    onClick={() => handleChoice(c.t)}
                                    disabled={loading}
                                    className="py-6 px-10 rounded-2xl border-white/5 hover:border-white/20 transition-all text-xs font-black tracking-widest"
                                >
                                    {c.t}
                                </PremiumButton>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </PremiumGameLayout>
    );
};

