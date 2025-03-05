import React, { useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import './ChatInput.css';
import FileUploader from './FileUploader';

const ChatInput = ({ sendMessage }) => {
  const { darkMode } = useContext(ThemeContext);
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() !== '' || selectedFile) {
      sendMessage(message, selectedFile);
      setMessage('');
      setSelectedFile(null);
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  return (
    <div className={`chat-input-container ${darkMode ? 'dark-mode' : ''}`}>
      {selectedFile && (
        <div className="file-preview-container">
          {selectedFile.type.startsWith('image/') ? (
            <div className="image-preview">
              <img 
                src={URL.createObjectURL(selectedFile)} 
                alt="Preview" 
                className="preview-image" 
              />
              <button 
                className="remove-file-btn"
                onClick={() => setSelectedFile(null)}
                type="button"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="file-preview">
              <span className="file-icon">📄</span>
              <span className="file-name">{selectedFile.name}</span>
              <button 
                className="remove-file-btn"
                onClick={() => setSelectedFile(null)}
                type="button"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}
      
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <FileUploader onFileSelect={handleFileSelect} />
        
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="message-input"
        />
        
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
