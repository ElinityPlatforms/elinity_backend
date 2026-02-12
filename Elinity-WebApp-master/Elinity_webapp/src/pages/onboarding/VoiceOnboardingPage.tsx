import React, { useState, useRef, useEffect } from 'react';
import { MdMic, MdStop, MdPlayArrow, MdArrowForward, MdGraphicEq } from 'react-icons/md';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { onboardingApi } from '../../api/onboarding';
import './VoiceOnboardingPage.css';

const VoiceOnboardingPage: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'recording' | 'processing' | 'ai_speaking'>('idle');
    const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string; audio?: string }[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);
    const audioPlayer = useRef<HTMLAudioElement | null>(null);

    const startOnboarding = async () => {
        setStatus('processing');
        try {
            const data = await onboardingApi.startVoice();
            const aiMsg = { role: 'ai' as const, text: data.message, audio: data.audio_filename };
            setMessages([aiMsg]);
            if (data.audio_filename) {
                playAiVoice(data.audio_filename);
            } else {
                setStatus('idle');
            }
        } catch (error) {
            console.error('Failed to start onboarding', error);
            setStatus('idle');
        }
    };

    const playAiVoice = (filename: string) => {
        const url = onboardingApi.getAudioUrl(filename);
        if (audioPlayer.current) {
            audioPlayer.current.src = url;
            audioPlayer.current.play();
            setStatus('ai_speaking');
        }
    };

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.current = new MediaRecorder(stream);
        audioChunks.current = [];

        mediaRecorder.current.ondataavailable = (e) => {
            audioChunks.current.push(e.data);
        };

        mediaRecorder.current.onstop = async () => {
            const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
            const audioFile = new File([audioBlob], 'onboarding_response.wav', { type: 'audio/wav' });
            sendResponse({ audio: audioFile });
        };

        mediaRecorder.current.start();
        setIsRecording(true);
        setStatus('recording');
    };

    const stopRecording = () => {
        mediaRecorder.current?.stop();
        setIsRecording(false);
    };

    const sendResponse = async (data: { text?: string; audio?: File }) => {
        setStatus('processing');
        try {
            const result = await onboardingApi.continueVoice(data);

            // Add user message if text was returned (from transcription)
            if (result.user_text) {
                setMessages(prev => [...prev, { role: 'user', text: result.user_text }]);
            } else if (data.text) {
                setMessages(prev => [...prev, { role: 'user', text: data.text! }]);
            }

            const aiMsg = { role: 'ai' as const, text: result.message, audio: result.audio_filename };
            setMessages(prev => [...prev, aiMsg]);

            if (result.audio_filename) {
                playAiVoice(result.audio_filename);
            } else {
                setStatus('idle');
            }
        } catch (error) {
            console.error('Failed to continue onboarding', error);
            setStatus('idle');
        }
    };

    return (
        <div className="voice-onboarding-container">
            <audio
                ref={audioPlayer}
                onEnded={() => setStatus('idle')}
                style={{ display: 'none' }}
            />

            <div className="onboarding-header">
                <h1>🎙️ Voice Onboarding</h1>
                <p>Welcome to Elinity. Let's get to know you through conversation.</p>
            </div>

            <div className="onboarding-view">
                <div className="chat-area">
                    {messages.length === 0 ? (
                        <div className="start-prompt">
                            <MdGraphicEq className="pulse-icon" />
                            <h3>Ready to begin?</h3>
                            <p>Elinity will ask you a few questions to set up your profile.</p>
                            <Button variant="primary" onClick={startOnboarding} size="lg">
                                Begin Consultation
                            </Button>
                        </div>
                    ) : (
                        <div className="messages-list">
                            {messages.map((m, i) => (
                                <div key={i} className={`message-bubble ${m.role}`}>
                                    <div className="bubble-text">{m.text}</div>
                                </div>
                            ))}
                            {status === 'processing' && (
                                <div className="message-bubble ai loading">
                                    <div className="dot-flashing"></div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="controls-area">
                    {messages.length > 0 && (
                        <div className="interaction-hub">
                            {status === 'idle' || status === 'recording' ? (
                                <button
                                    className={`mic-button ${isRecording ? 'active' : ''}`}
                                    onMouseDown={startRecording}
                                    onMouseUp={stopRecording}
                                    onTouchStart={startRecording}
                                    onTouchEnd={stopRecording}
                                >
                                    {isRecording ? <MdStop /> : <MdMic />}
                                    <span className="mic-label">
                                        {isRecording ? 'Listening...' : 'Hold to Speak'}
                                    </span>
                                </button>
                            ) : status === 'ai_speaking' ? (
                                <div className="ai-status">
                                    <div className="vocal-bars">
                                        <div className="bar"></div>
                                        <div className="bar"></div>
                                        <div className="bar"></div>
                                        <div className="bar"></div>
                                    </div>
                                    <span>Lumi is speaking...</span>
                                </div>
                            ) : (
                                <div className="ai-status">
                                    <span>Processing your response...</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="onboarding-footer">
                <p>You can also type your responses if you prefer.</p>
                {/* Add a simple text input fallback if needed */}
            </div>
        </div>
    );
};

export default VoiceOnboardingPage;
