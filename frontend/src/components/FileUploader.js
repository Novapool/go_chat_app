import React, { useState, useRef, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import '../styles/FileUploader.css';

const FileUploader = ({ onFileSelect }) => {
  const { darkMode } = useContext(ThemeContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // For non-image files, just show the file name
      setPreview(null);
    }

    if (onFileSelect) onFileSelect(file);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onFileSelect) onFileSelect(null);
  };

  return (
    <div className={`file-uploader ${darkMode ? 'dark-mode' : ''}`}>
      <button 
        className="select-file-btn"
        onClick={() => fileInputRef.current?.click()}
        type="button"
      >
        📎
      </button>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="file-input"
        accept="image/*,.pdf,.doc,.docx"
      />
      
      {selectedFile && (
        <div className="selected-file">
          <span className="file-name">{selectedFile.name}</span>
          <button 
            className="clear-btn"
            onClick={clearSelection}
            type="button"
          >
            ✕
          </button>
        </div>
      )}
      
      {preview && (
        <div className="file-preview">
          <img 
            src={preview} 
            alt="Preview" 
            className="preview-image" 
          />
        </div>
      )}
    </div>
  );
};

export default FileUploader;
