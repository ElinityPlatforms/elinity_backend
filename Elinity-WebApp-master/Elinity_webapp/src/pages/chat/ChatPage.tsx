import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MdSend, MdAttachFile, MdMoreVert, MdSearch, MdGroupAdd, MdPeople, MdPsychology } from 'react-icons/md';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useApiClient } from "../../services/apiClient";
import { chatApi } from '../../api/chat';
import CreateGroupModal from './components/CreateGroupModal';
import './ChatPage.css';

const ChatPage: React.FC = () => {
    const fetchWithAuth = useApiClient();
    const [selectedChat, setSelectedChat] = useState<any | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data: chats, isLoading: isChatsLoading, refetch: refetchChats } = useQuery({
        queryKey: ['chats'],
        queryFn: chatApi.getChats,
    });

    const { data: messages, isLoading: isMessagesLoading, refetch: refetchMessages } = useQuery({
        queryKey: ['chat-history', selectedChat?.group_id],
        queryFn: () => chatApi.getChatHistory(selectedChat.group_id),
        enabled: !!selectedChat?.group_id,
        refetchInterval: 5000,
    });

    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleLumiAnalysis = async () => {
        if (!selectedChat?.group_id) return;
        setIsAnalyzing(true);
        try {
            const res = await fetchWithAuth(`/lumi/relationship-coach/analyze-chat/${selectedChat.group_id}`, {
                method: 'POST'
            });
            if (res.ok) {
                alert("Lumi is now analyzing your conversation. Check your notifications in a few moments for deep relationship insights! ✨");
            }
        } catch (error) {
            console.error("Lumi analysis failed:", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !selectedChat) return;

        try {
            if (selectedChat.type === 'users_ai') {
                // Direct Message
                await chatApi.sendDirectMessage(selectedChat.other_user_id, messageInput);
            } else {
                // Group Message
                await chatApi.sendGroupMessage(selectedChat.group_id, messageInput);
            }
            setMessageInput('');
            refetchMessages();
            refetchChats();
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const formatTime = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="chat-page-content">
            <div className="chat-container">
                {/* Chat List */}
                <div className="chat-list-panel">
                    <div className="chat-list-header">
                        <h2>Sanctuary Chats</h2>
                        <button
                            className="create-group-btn"
                            onClick={() => setIsCreateModalOpen(true)}
                            title="Create Group"
                        >
                            <MdGroupAdd />
                        </button>
                    </div>

                    <div className="chat-search">
                        <Input
                            placeholder="Find a conversation..."
                            leftIcon={<MdSearch />}
                            fullWidth
                        />
                    </div>

                    <div className="chat-list">
                        {isChatsLoading ? (
                            <div className="chat-loading">Calibrating signals...</div>
                        ) : chats && chats.length > 0 ? (
                            chats.map((chat: any) => (
                                <div
                                    key={chat.group_id}
                                    className={`chat-item ${chat.type === 'group' ? 'group-chat-type' : ''} ${selectedChat?.group_id === chat.group_id ? 'active' : ''}`}
                                    onClick={() => setSelectedChat(chat)}
                                >
                                    <div className="chat-avatar-container">
                                        <div className="chat-avatar">
                                            {chat.avatar ? (
                                                <img src={chat.avatar} alt={chat.name} />
                                            ) : (
                                                chat.type === 'group' ? <MdPeople /> : (chat.name?.[0] || '?')
                                            )}
                                        </div>
                                        {chat.type === 'group' && <span className="group-indicator"></span>}
                                    </div>
                                    <div className="chat-item-content">
                                        <div className="chat-item-header">
                                            <h4>{chat.name || 'Anonymous Conversation'}</h4>
                                            <span className="chat-time">{formatTime(chat.time)}</span>
                                        </div>
                                        <p className="chat-preview">
                                            {chat.last_message || 'Start a new conversation...'}
                                        </p>
                                    </div>
                                    {chat.unread > 0 && (
                                        <div className="chat-unread-badge">{chat.unread}</div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="chat-empty">
                                <p>No active frequencies found.</p>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={async () => {
                                        await chatApi.seed();
                                        refetchChats();
                                    }}
                                >
                                    Populate Connections
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="chat-messages-panel">
                    {selectedChat ? (
                        <>
                            <div className="chat-messages-header">
                                <div className="chat-header-info">
                                    <div className="chat-avatar">
                                        {selectedChat.avatar ? (
                                            <img src={selectedChat.avatar} alt="" />
                                        ) : (
                                            selectedChat.type === 'group' ? <MdPeople /> : 'U'
                                        )}
                                    </div>
                                    <div>
                                        <div className="chat-header-name-row">
                                            <h3>{selectedChat.name}</h3>
                                            {selectedChat.type === 'group' && <span className="badge-group">Group</span>}
                                        </div>
                                        <span className="chat-status">
                                            {selectedChat.type === 'group' ? 'Multi-user Discussion' : 'Active Connection'}
                                        </span>
                                    </div>
                                </div>
                                <div className="chat-actions" style={{ display: 'flex', gap: '8px' }}>
                                    {(selectedChat.type === 'users_ai' || selectedChat.type === 'group') && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleLumiAnalysis}
                                            disabled={isAnalyzing}
                                            leftIcon={<MdPsychology />}
                                            style={{
                                                fontSize: '11px',
                                                padding: '4px 12px',
                                                borderColor: 'var(--primary)',
                                                color: 'var(--primary)',
                                                background: 'rgba(162, 89, 230, 0.05)'
                                            }}
                                        >
                                            {isAnalyzing ? "Lumi is thinking..." : "Lumi Insight"}
                                        </Button>
                                    )}
                                    <button className="icon-btn"><MdMoreVert /></button>
                                </div>
                            </div>

                            <div className="chat-messages-area">
                                {!isMessagesLoading && messages && messages.length > 0 ? (
                                    messages.map((msg: any) => (
                                        <div key={msg.id} className={`message ${msg.is_me ? 'message-sent' : 'message-received'}`}>
                                            {!msg.is_me && (
                                                <div className="message-avatar">
                                                    {msg.sender_avatar ? (
                                                        <img src={msg.sender_avatar} alt="" />
                                                    ) : (
                                                        <div className="avatar-placeholder">{msg.sender_name?.[0] || 'U'}</div>
                                                    )}
                                                </div>
                                            )}
                                            <div className="message-content">
                                                {!msg.is_me && selectedChat.type === 'group' && (
                                                    <span className="message-sender-name">{msg.sender_name}</span>
                                                )}
                                                <div className="message-bubble">
                                                    {msg.text}
                                                </div>
                                                <span className="message-time">{formatTime(msg.time)}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="chat-messages-empty">
                                        {isMessagesLoading ? 'Retrieving records...' : 'Be the first to say something!'}
                                    </div>
                                )}
                            </div>

                            <div className="chat-input-area">
                                <button className="icon-btn">
                                    <MdAttachFile />
                                </button>
                                <input
                                    type="text"
                                    className="chat-input"
                                    placeholder={`Message ${selectedChat.name}...`}
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button
                                    className="send-btn"
                                    onClick={handleSendMessage}
                                    disabled={!messageInput.trim()}
                                >
                                    <MdSend />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="chat-no-selection">
                            <div className="chat-no-selection-content">
                                <div className="chat-no-selection-icon">🌌</div>
                                <h3>Select a Sanctuary Signal</h3>
                                <p>Open a conversation or create a group to start collaborating.</p>
                                <Button
                                    variant="outline"
                                    leftIcon={<MdGroupAdd />}
                                    onClick={() => setIsCreateModalOpen(true)}
                                >
                                    Create Group
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isCreateModalOpen && (
                <CreateGroupModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={(newGroup) => {
                        setIsCreateModalOpen(false);
                        refetchChats();
                        // Automatically select the new group
                        setSelectedChat({
                            group_id: newGroup.id,
                            name: newGroup.name,
                            type: newGroup.type,
                            avatar: null
                        });
                    }}
                />
            )}
        </div>
    );
};

export default ChatPage;
