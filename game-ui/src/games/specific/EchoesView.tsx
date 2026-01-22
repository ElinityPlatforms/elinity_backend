import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { sendAction } from '../../api/client';
import { PremiumButton, PremiumText } from '../../components/shared/PremiumComponents';
import { Mic2, Activity, Volume2, Radio, Waves, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumGameLayout } from '../PremiumGameLayout';

export const EchoesView = () => {
    const { gameState, sessionId, userId, updateGameState, gameSlug } = useGame();
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    if (!gameState) return null;

    const prompt = gameState.last_ai_response?.creative_prompt || "The silence waits for your frequency.";
    const echo = gameState.last_ai_response?.echo_synthesis || "";

    // Stats
    const resonance = gameState.resonance ?? 10;
    const clarity = gameState.clarity ?? 50;

    const handleSubmit = async () => {
        if (!input.trim() || !sessionId) return;
        setLoading(true);
        try {
            const resp = await sendAction(gameSlug!, sessionId!, userId, 'express', input);
            if (resp.ok) {
                updateGameState(resp.state);
                setInput("");
            }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    return (
        <PremiumGameLayout
            title="Echoes & Expressions"
            subtitle="The Resonance Chamber"
            icon={Waves}
            backgroundVar="void"
            guideText="1. Transmit your inner frequency into the chamber.\n2. Resonance measures the power of the group's collective energy.\n3. Clarity measures the purity and transparency of the expressions.\n4. The Architect synthesizes the 'Echo' of your shared truth."
        >
            <div className="h-full flex flex-col items-center justify-center relative p-8 gap-12 max-w-5xl mx-auto">

                {/* Visualizer Background */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-20">
                    {[...Array(40)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-[1px] h-64 bg-cyan-400 mx-1"
                            animate={{
                                scaleY: [0.1, 0.5 + (Math.sin(i * 0.5) * 0.4), 0.1],
                                opacity: [0.2, 0.8, 0.2]
                            }}
                            transition={{
                                duration: 1.5 + (i % 10) * 0.1,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.05
                            }}
                        />
                    ))}
                </div>

                {/* Status Meters */}
                <div className="w-full grid grid-cols-2 gap-12 relative z-10 px-10">
                    <div className="space-y-3">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.3em] text-cyan-400">
                            <div className="flex items-center gap-2"><Activity size={12} /> Resonance</div>
                            <span>{resonance}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div animate={{ width: `${resonance}% ` }} className="h-full bg-cyan-400 shadow-[0_0_15px_#22d3ee]" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400">
                            <div className="flex items-center gap-2"><Zap size={12} /> Clarity</div>
                            <span>{clarity}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div animate={{ width: `${clarity}% ` }} className="h-full bg-indigo-400 shadow-[0_0_15px_#818cf8]" />
                        </div>
                    </div>
                </div>

                {/* Main Prompt Display */}
                <div className="relative z-10 w-full text-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={prompt}
                            initial={{ opacity: 0, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, filter: 'blur(10px)' }}
                            className="bg-black/40 backdrop-blur-3xl p-16 rounded-[4rem] border border-white/5 shadow-3xl min-h-[300px] flex flex-col justify-center"
                        >
                            <div className="flex items-center justify-center gap-2 text-white/20 text-[10px] uppercase tracking-[0.5em] mb-12">
                                <Radio size={12} className="animate-pulse" /> INPUT FREQUENCY
                            </div>
                            <h2 className="text-4xl md:text-6xl font-serif italic text-white leading-tight">
                                <PremiumText text={prompt} />
                            </h2>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* AI Echo Synthesis Overlay */}
                <AnimatePresence>
                    {echo && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="relative z-20 -mt-24 bg-white/5 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-2xl max-w-2xl text-center"
                        >
                            <div className="flex items-center justify-center gap-2 text-cyan-400 mb-4">
                                <Volume2 size={16} /> <span className="text-[9px] font-black uppercase tracking-widest">Echo Synthesized</span>
                            </div>
                            <p className="text-xl text-gray-300 font-serif italic leading-relaxed">"{echo}"</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Input Area */}
                <div className="relative z-30 w-full max-w-3xl">
                    <div className="bg-black/80 backdrop-blur-3xl border border-white/10 p-3 rounded-[2.5rem] flex items-center gap-4 focus-within:border-cyan-500/50 transition-all shadow-2xl">
                        <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                            <Mic2 size={20} />
                        </div>
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                            placeholder="Echo your truth into the void..."
                            className="flex-1 bg-transparent border-none text-white placeholder:text-white/10 py-4 px-2 focus:outline-none font-serif text-xl"
                            disabled={loading}
                        />
                        <PremiumButton
                            onClick={handleSubmit}
                            disabled={!input || loading}
                            variant="secondary"
                            className="h-12 px-8 rounded-full !border-cyan-500/20 hover:!bg-cyan-500/10 text-cyan-400 font-black text-[10px] tracking-widest"
                        >
                            {loading ? <Activity className="animate-spin" size={16} /> : 'TRANSMIT'}
                        </PremiumButton>
                    </div>
                </div>

                {/* Footer History Ticker */}
                <div className="flex gap-4 overflow-hidden mask-fade-edges w-full justify-center opacity-30">
                    {gameState.gallery?.slice(-4).map((g: { expression: string }, i: number) => (
                        <div key={i} className="text-[8px] font-black uppercase tracking-[0.2em] whitespace-nowrap text-white/50 border border-white/10 px-4 py-1 rounded-full">
                            {g.expression.substring(0, 20)}...
                        </div>
                    ))}
                </div>
            </div>
        </PremiumGameLayout>
    );
};
