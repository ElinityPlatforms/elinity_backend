import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { MdArrowBack, MdSend, MdHistory, MdEmojiObjects, MdInfo } from 'react-icons/md';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { skillsApi } from '../../api/skills';
import './SkillPracticePage.css';

const SkillPracticePage: React.FC = () => {
    const { type, skillId } = useParams<{ type: string; skillId: string }>();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<any[]>([]);
    const [userInput, setUserInput] = useState('');
    const [sessionId, setSessionId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Start Session
    const startMutation = useMutation({
        mutationFn: () => skillsApi.startSkillSession(type as any, parseInt(skillId!)),
        onSuccess: (data) => {
            setSessionId(data.session_id);
            setMessages([
                { role: 'assistant', content: data.ai_message, time: new Date().toISOString() }
            ]);
        }
    });

    // Reply Mutation
    const replyMutation = useMutation({
        mutationFn: (input: string) => skillsApi.replyToSkillSession(type as any, parseInt(skillId!), sessionId!, input),
        onSuccess: (data) => {
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply, time: new Date().toISOString() }]);
        }
    });

    useEffect(() => {
        if (type && skillId) {
            startMutation.mutate();
        }
    }, [type, skillId]);

    const handleSend = () => {
        if (!userInput.trim() || replyMutation.isPending) return;

        const input = userInput;
        setUserInput('');
        setMessages(prev => [...prev, { role: 'user', content: input, time: new Date().toISOString() }]);
        replyMutation.mutate(input);
    };

    const handleFinish = () => {
        if (sessionId) {
            navigate(`/skills/evaluation/${sessionId}`);
        }
    };

    return (
        <div className="practice-page-content" style={{ padding: '24px' }}>
            <div className="practice-header">
                <Button
                    variant="ghost"
                    leftIcon={<MdArrowBack />}
                    onClick={() => navigate('/skills')}
                >
                    Back to Skills
                </Button>
                <div className="skill-info">
                    <h2>Session Practice</h2>
                    <p>{type?.replace('-', ' ')} Coach</p>
                </div>
                {messages.length > 2 && (
                    <Button
                        variant="primary"
                        onClick={handleFinish}
                        className="finish-btn"
                    >
                        Finish & Evaluate
                    </Button>
                )}
            </div>

            <div className="practice-main-layout">
                <div className="practice-chat-container">
                    <div className="chat-history">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`message-wrapper ${msg.role}`}>
                                <div className="message-bubble">
                                    {msg.content}
                                </div>
                                <span className="message-time">
                                    {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))}
                        {replyMutation.isPending && (
                            <div className="message-wrapper assistant">
                                <div className="message-bubble typing">
                                    <div className="dot" />
                                    <div className="dot" />
                                    <div className="dot" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input-area">
                        <input
                            type="text"
                            placeholder="Share your thoughts or ask for guidance..."
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button
                            className="send-btn"
                            onClick={handleSend}
                            disabled={!userInput.trim() || replyMutation.isPending}
                        >
                            <MdSend />
                        </button>
                    </div>
                </div>

                <div className="practice-sidebar">
                    <Card variant="glass" className="coaching-card">
                        <h3 className="card-title">
                            <MdEmojiObjects /> Coaching Tips
                        </h3>
                        <ul>
                            <li>Be honest and specific about your situations.</li>
                            <li>Ask for actionable steps you can try today.</li>
                            <li>Reflect on how you feel after each suggestion.</li>
                        </ul>
                    </Card>

                    <Card variant="glass" className="coaching-card info">
                        <h3 className="card-title">
                            <MdInfo /> Session Info
                        </h3>
                        <p>This is a safe space for growth. Your responses help the AI tailor its coaching to your unique personality and values.</p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SkillPracticePage;
