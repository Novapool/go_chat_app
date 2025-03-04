import React from 'react';
import './ChatHistory.css';

const ChatHistory = ({ messages }) => (
  <div className="chat-history">
    <h2>Chat History</h2>
    <div className="messages">
      {messages.map((msg, index) => (
        <div key={index} className="message">
          {msg.sender && <span className="sender">{msg.sender}: </span>}
          <span className="content">{msg.body}</span>
        </div>
      ))}
    </div>
  </div>
);

export default ChatHistory;