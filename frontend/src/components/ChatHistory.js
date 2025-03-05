import React, { useRef, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import './ChatHistory.css';
import MessageWithFile from './MessageWithFile';

const ChatHistory = ({ messages }) => {
  const { darkMode } = useContext(ThemeContext);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={`chat-history ${darkMode ? 'dark-mode' : ''}`}>
      <div className="messages">
        {messages.map((msg, index) => {
          // Check if it's a system message
          const isSystemMessage = msg.isSystem || msg.sender === "System";
          
          return (
            <div 
              key={index} 
              className={`message-container ${msg.fileURL ? 'has-file' : ''} ${isSystemMessage ? 'system-message' : ''}`}
            >
              {msg.fileURL ? (
                <MessageWithFile message={msg} />
              ) : (
                <div className="message">
                  {!isSystemMessage && msg.sender && (
                    <div className="message-sender">{msg.sender}</div>
                  )}
                  <div className="message-content">
                    {isSystemMessage ? (
                      <span className="system-text">
                        {msg.body}
                      </span>
                    ) : (
                      msg.body
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatHistory;
