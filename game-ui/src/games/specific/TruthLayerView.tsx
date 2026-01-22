import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { sendAction } from '../../api/client';
import { PremiumButton, PremiumText } from '../../components/shared/PremiumComponents';
import { Layers, Eye, ShieldCheck, Heart, Ghost } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumGameLayout } from '../PremiumGameLayout';

export const TruthLayerView = () => {
    const { gameState, sessionId, userId, updateGameState, gameSlug } = useGame();
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    if (!gameState) return null;

    const question = gameState.current_question || "Gaze into the mirror of the self...";
    const layer = gameState.layer || 1;
    const integrity = gameState.integrity ?? 100;
    const vulnerability = gameState.vulnerability ?? 10;
    const message = gameState.last_ai_response?.reflection || "Only the truth will set you free.";

    const handleAnswer = async () => {
        if (!sessionId || !gameSlug || !input) return;
        setLoading(true);
        try {
            const resp = await sendAction(gameSlug, sessionId, userId, 'answer', input);
            if (resp.ok) updateGameState(resp.state);
        } catch (e) { console.error(e); }
        setLoading(false);
        setInput("");
    };

    // Calculate background opacity based on layer
    const layerOpacity = Math.min(1, layer * 0.3);

    return (
        <PremiumGameLayout
            title="Truth & Layer"
            subtitle={`Depth: Phase ${layer}`}
            icon={Layers}
            backgroundVar="void"
            guideText="1. The Shadow Observer listens to your words.\n2. Integrity measures your honesty with yourself.\n3. Vulnerability measures the depth of your revelation.\n4. Every two truths, we descend to a deeper phase."
        >
            <div className="flex flex-col h-full relative overflow-hidden">

                {/* Background Shadow Effect */}
                <div className="absolute inset-0 bg-black pointer-events-none transition-all duration-[3000ms]" style={{ opacity: layerOpacity }} />

                {/* Stats Top Bar */}
                <div className="flex justify-between items-start p-6 relative z-10">
                    <div className="flex gap-6">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 text-indigo-400 mb-1">
                                <ShieldCheck size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Integrity</span>
                            </div>
                            <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${integrity}%` }}
                                    className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1]"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 text-rose-400 mb-1">
                                <Heart size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Vulnerability</span>
                            </div>
                            <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${vulnerability}%` }}
                                    className="h-full bg-rose-500 shadow-[0_0_10px_#f43f5e]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(l => (
                            <div
                                key={l}
                                className={`w-2 h-2 rounded-full transition-all duration-700 ${layer >= l ? 'bg-white shadow-[0_0_10px_white]' : 'bg-white/10'}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">

                    {/* Reflection / AI Message */}
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={message.substring(0, 20)}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="mb-12 max-w-xl text-center"
                        >
                            <p className="text-gray-400 font-serif italic text-lg leading-relaxed">
                                "{message}"
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* The Big Question */}
                    <div className="w-full max-w-4xl text-center mb-20">
                        <AnimatePresence mode="wait">
                            <motion.h3
                                key={question}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                className="text-4xl md:text-7xl font-extralight text-white leading-tight font-premium drop-shadow-2xl"
                            >
                                <PremiumText text={question} />
                            </motion.h3>
                        </AnimatePresence>
                    </div>

                    {/* Input System */}
                    <div className="w-full max-w-xl group relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-rose-500/10 blur-2xl rounded-[3rem] opacity-0 group-focus-within:opacity-100 transition duration-1000" />

                        <div className="relative bg-black/40 backdrop-blur-3xl border border-white/5 p-4 rounded-[2.5rem] shadow-2xl overflow-hidden">
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAnswer()}
                                placeholder="Speak your truth..."
                                className="w-full bg-transparent border-none text-white text-center text-2xl placeholder:text-white/5 py-8 px-6 focus:outline-none font-serif transition-all"
                            />

                            <motion.div
                                className="h-[1px] w-0 bg-white/20 mx-auto"
                                animate={{ width: input ? '80%' : '0%' }}
                            />

                            <div className="mt-4 flex justify-center pb-2">
                                <PremiumButton
                                    className={`px-12 py-4 rounded-full text-[10px] font-black tracking-[0.4em] transition-all duration-500 ${!input ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                                    onClick={handleAnswer}
                                    disabled={loading || !input}
                                >
                                    {loading ? <Ghost className="animate-pulse" /> : 'SURRENDER TRUTH'}
                                </PremiumButton>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 text-white/10 text-[10px] font-black tracking-[0.5em] uppercase flex items-center gap-3">
                        <Eye size={14} /> The abyss gazes back
                    </div>
                </div>
            </div>
        </PremiumGameLayout>
    );
};

