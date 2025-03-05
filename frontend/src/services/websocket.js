let socket;
let connected = false;

export const connectWebSocket = (cb) => {
  if (connected) return;
  
  console.log('Connecting to WebSocket');
  socket = new WebSocket('ws://localhost:8080/ws');
  
  socket.onopen = () => {
    console.log('WebSocket connection established');
    connected = true;
  };
  
  socket.onclose = () => {
    console.log('WebSocket connection closed');
    connected = false;
  };
  
  socket.onmessage = (message) => {
    try {
      const parsedMessage = JSON.parse(message.data);
      console.log('Received message:', parsedMessage);
      cb(parsedMessage);
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  };
  
  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
};

export const sendMessage = (message, file = null) => {
  if (!socket || !connected) {
    console.error('Cannot send message, socket not connected');
    return;
  }

  // For now, just send the text message
  // In a real implementation, you would upload the file first
  // and then send a message with the file URL
  
  // Mock implementation - in the future, this would be replaced with actual file upload
  if (file) {
    console.log('File selected:', file);
    // Temporarily create a mock URL for images (for UI testing only)
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const mockMessage = {
          type: 1,
          body: message || '',
          sender: JSON.parse(localStorage.getItem('user')).username,
          fileURL: reader.result,
          fileName: file.name,
          fileType: file.type
        };
        socket.send(JSON.stringify(mockMessage));
      };
      reader.readAsDataURL(file);
      return; // Early return since we'll send in the onloadend callback
    } else {
      // For non-image files
      const mockMessage = {
        type: 1,
        body: message || '',
        sender: JSON.parse(localStorage.getItem('user')).username,
        fileURL: '#',
        fileName: file.name,
        fileType: file.type
      };
      socket.send(JSON.stringify(mockMessage));
      return;
    }
  }
  
  // Send regular text message
  const textMessage = {
    type: 1,
    body: message,
    sender: JSON.parse(localStorage.getItem('user')).username
  };
  socket.send(JSON.stringify(textMessage));
};

export const disconnectWebSocket = () => {
  if (socket) {
    socket.close();
    connected = false;
  }
};
