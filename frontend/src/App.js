import React, { useState, useEffect } from 'react';
import './App.css';
import ChatHistory from './components/ChatHistory';
import ChatInput from './components/ChatInput';
import { connectWebSocket, sendMessage, disconnectWebSocket } from './services/websocket';

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Connect to WebSocket and receive messages
    connectWebSocket((message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup on unmount
    return () => {
      disconnectWebSocket();
    };
  }, []);

  const handleSendMessage = (message) => {
    sendMessage(message);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Real-time Chat App</h1>
      </header>
      <main className="App-main">
        <ChatHistory messages={messages} />
        <ChatInput sendMessage={handleSendMessage} />
      </main>
    </div>
  );
}

export default App;