import React, { useState, useEffect } from 'react';
import './App.css';
import ChatHistory from './components/ChatHistory';
import ChatInput from './components/ChatInput';
import AuthPage from './pages/AuthPage';
import { ThemeProvider } from './context/ThemeContext';
import { connectWebSocket, sendMessage, disconnectWebSocket } from './services/websocket';

function App() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Only connect to WebSocket if user is logged in
    if (user) {
      // Connect to WebSocket and receive messages
      connectWebSocket((message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      // Cleanup on unmount
      return () => {
        disconnectWebSocket();
      };
    }
  }, [user]);

  const handleSendMessage = (messageText, file) => {
    // For now, just send the text message
    // In the future, this will handle file uploads
    sendMessage(messageText, file);
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    disconnectWebSocket();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <ThemeProvider>
      {!user ? (
        <AuthPage onLogin={handleLogin} />
      ) : (
        <div className="App">
          <header className="App-header">
            <h1>NovaChat</h1>
            <div className="user-controls">
              <span className="username">{user.username}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </header>
          <main className="App-main">
            <ChatHistory messages={messages} />
            <ChatInput sendMessage={handleSendMessage} />
          </main>
        </div>
      )}
    </ThemeProvider>
  );
}

export default App;
