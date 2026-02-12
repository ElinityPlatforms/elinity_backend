import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { MdSend, MdPsychology } from 'react-icons/md';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { lumiApi } from '../../api/lumi';
import { aiModesApi } from '../../api/ai_modes';
import './LumiChatPage.css';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const LumiChatPage: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const mode = queryParams.get('mode');

    const [messages, setMessages] = useState<Message[]>([]);
    const [sessionId, setSessionId] = useState<string | undefined>();
    const [input, setInput] = useState('');
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const messagesAreaRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
        if (messagesAreaRef.current) {
            const container = messagesAreaRef.current;
            container.scrollTo({
                top: container.scrollHeight,
                behavior: behavior
            });
        }
    };

    // Fetch history on mount
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                let history;
                if (mode) {
                    history = await aiModesApi.getHistory(mode);
                } else {
                    history = await lumiApi.getHistory();
                }

                if (history && history.length > 0) {
                    const mappedMessages: Message[] = history.map((h: any) => ({
                        id: h.id,
                        role: h.role,
                        content: h.content,
                        timestamp: new Date(h.timestamp)
                    }));
                    setMessages(mappedMessages);

                    // Set the session ID from the last turn context if needed (though the backend handles it via recent session)
                    // For mode sessions, we'll let the next chat message pick it up or return it
                } else {
                    setMessages([
                        {
                            id: 'welcome',
                            role: 'assistant',
                            content: mode
                                ? `Hello! I'm now operating in "${mode.replace(/_/g, ' ')}" mode. I've synced with your profile and I'm ready to provide insights from this unique perspective. How should we begin?`
                                : "Hello! I'm Lumi, your AI companion. I'm here to help you sync with your deeper self and find meaningful connections. How can I assist you today?",
                            timestamp: new Date(),
                        },
                    ]);
                }
            } catch (error) {
                console.error("Failed to fetch history:", error);
                // Fallback welcome message on error
                setMessages([
                    {
                        id: 'error-welcome',
                        role: 'assistant',
                        content: "Hello! I'm here and ready to chat. What's on your mind?",
                        timestamp: new Date(),
                    },
                ]);
            } finally {
                setIsLoadingHistory(false);
                // Extra scroll after loading
                setTimeout(() => scrollToBottom('auto'), 100);
            }
        };

        fetchHistory();
    }, [mode]);

    // Scroll whenever messages update
    useEffect(() => {
        scrollToBottom();
        // Fallback for slower renders
        const timer = setTimeout(scrollToBottom, 300);
        return () => clearTimeout(timer);
    }, [messages]);

    const chatMutation = useMutation({
        mutationFn: (msg: string) => {
            if (mode) {
                return aiModesApi.startModeSession(mode, msg);
            }
            return lumiApi.chat(msg, sessionId);
        },
        onSuccess: (data) => {
            if (data.session_id) {
                setSessionId(data.session_id);
            }
            const assistantMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: data.ai_message || data.LumiAI || 'I apologize, but I couldn\'t generate a response.',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
        },

        onError: (error: any) => {
            console.error('Chat error:', error);
            const errorMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: "I'm having trouble connecting right now. Please check your internet or try again in a moment.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        }
    });

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        chatMutation.mutate(input);
        setInput('');
    };


    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Simplified auto-scroll logic moved above

    const displayMode = mode ? mode.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Lumi AI';

    return (
        <div className="lumi-chat-content">
            {/* Header */}
            <div className="lumi-header">
                <div className="lumi-avatar">
                    <MdPsychology />
                </div>
                <div>
                    <h1 className="lumi-title">💫 {displayMode}</h1>
                    <p className="lumi-subtitle">
                        {mode
                            ? `Operating in specialized ${displayMode} mode with Radical Awareness.`
                            : "Your all-access companion: insights, app guidance, and deep sync."
                        }
                    </p>
                </div>
            </div>

            {/* Chat Container */}
            <Card variant="glass" className="chat-container">
                <div className="messages-area" ref={messagesAreaRef}>
                    {isLoadingHistory ? (
                        <div className="history-loading">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <p>Retrieving our past conversations...</p>
                        </div>
                    ) : (
                        <>
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
                                >
                                    {message.role === 'assistant' && (
                                        <div className="message-avatar">
                                            <MdPsychology />
                                        </div>
                                    )}
                                    <div className="message-content">
                                        <div className="message-text">{message.content}</div>
                                        <div className="message-time">
                                            {message.timestamp.toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </div>
                                    </div>
                                    {message.role === 'user' && (
                                        <div className="message-avatar user-avatar">
                                            You
                                        </div>
                                    )}
                                </div>
                            ))}
                        </>
                    )}
                    {chatMutation.isPending && (
                        <div className="message assistant-message">
                            <div className="message-avatar">
                                <MdPsychology />
                            </div>
                            <div className="message-content">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>


                {/* Input Area */}
                <div className="input-area">
                    <textarea
                        className="chat-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask Lumi anything..."
                        rows={1}
                        autoFocus
                    />
                    <Button
                        variant="primary"
                        leftIcon={<MdSend />}
                        onClick={handleSend}
                        disabled={!input.trim() || chatMutation.isPending}
                        loading={chatMutation.isPending}
                    >
                        Send
                    </Button>
                </div>
            </Card>

            {/* Suggestions */}
            <div className="suggestions">
                <button
                    className="suggestion-chip"
                    onClick={() => setInput("Help me understand my personality better")}
                >
                    💭 Understand my personality
                </button>
                <button
                    className="suggestion-chip"
                    onClick={() => setInput("Give me relationship advice")}
                >
                    ❤️ Relationship advice
                </button>
                <button
                    className="suggestion-chip"
                    onClick={() => setInput("Help me set meaningful goals")}
                >
                    🎯 Set goals
                </button>
                <button
                    className="suggestion-chip"
                    onClick={() => setInput("I need motivation today")}
                >
                    ⚡ Daily motivation
                </button>
            </div>
        </div>
    );
};

export default LumiChatPage;
