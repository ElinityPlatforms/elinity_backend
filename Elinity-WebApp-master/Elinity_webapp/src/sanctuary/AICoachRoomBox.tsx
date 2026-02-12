import React, { useState } from 'react';
import { MdPsychology, MdSend, MdChatBubbleOutline, MdAutoAwesome } from 'react-icons/md';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'coach';
  timestamp: Date;
}

const AICoachRoomBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI Coach. How can I support you today?",
      sender: 'coach',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputMessage,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');

      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: messages.length + 2,
          text: "That's a great question! Let's explore that together. What specific aspect would you like to focus on?",
          sender: 'coach',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const quickPrompts = [
    'Help me set goals',
    'I need motivation',
    'Work-life balance',
    'Personal growth tips',
  ];

  return (
    <div className="sanctuary-box ai-coach-box">
      <div className="box-header">
        <div className="box-icon ai-coach-icon">
          <MdPsychology />
        </div>
        <h2 className="box-title">AI Coach Room</h2>
      </div>
      <p className="box-description">
        Your personal AI coach for guidance, motivation, and support on your journey.
      </p>

      <div className="coach-content">
        <div className="coach-chat">
          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message ${message.sender === 'user' ? 'user-message' : 'coach-message'}`}
              >
                <div className="message-avatar">
                  {message.sender === 'coach' ? (
                    <MdAutoAwesome />
                  ) : (
                    <MdChatBubbleOutline />
                  )}
                </div>
                <div className="message-content">
                  <p className="message-text">{message.text}</p>
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="quick-prompts">
            <span className="prompts-label">Quick prompts:</span>
            <div className="prompts-list">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  className="quick-prompt-btn"
                  onClick={() => setInputMessage(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="chat-input-container">
            <input
              type="text"
              className="chat-input"
              placeholder="Ask your AI coach anything..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button className="send-btn" onClick={sendMessage}>
              <MdSend />
            </button>
          </div>
        </div>

        <div className="coach-features">
          <div className="feature-card">
            <h3 className="feature-title">Goal Setting</h3>
            <p className="feature-desc">Get help setting and achieving your goals</p>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">Motivation</h3>
            <p className="feature-desc">Receive personalized encouragement</p>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">Insights</h3>
            <p className="feature-desc">Gain valuable self-awareness insights</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICoachRoomBox;
