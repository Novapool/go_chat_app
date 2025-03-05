import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import '../styles/MessageWithFile.css';

const MessageWithFile = ({ message }) => {
  const { darkMode } = useContext(ThemeContext);
  const { sender, body, fileURL, fileName, fileType } = message;
  
  const isImage = fileType && fileType.startsWith('image/');

  return (
    <div className={`message-with-file ${darkMode ? 'dark-mode' : ''}`}>
      {sender && <div className="message-sender">{sender}</div>}
      
      {isImage && fileURL && (
        <div className="message-image-container">
          <img src={fileURL} alt={fileName || "Shared"} className="message-image" />
        </div>
      )}
      
      {!isImage && fileName && (
        <div className="message-file">
          <span className="file-icon">📄</span>
          <span className="file-name">{fileName}</span>
        </div>
      )}
      
      {body && <div className="message-text">{body}</div>}
    </div>
  );
};

export default MessageWithFile;
