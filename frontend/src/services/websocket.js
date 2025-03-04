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
    const parsedMessage = JSON.parse(message.data);
    console.log('Received message:', parsedMessage);
    cb(parsedMessage);
  };
  
  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
};

export const sendMessage = (message) => {
  if (socket && connected) {
    socket.send(message);
  } else {
    console.error('Cannot send message, socket not connected');
  }
};

export const disconnectWebSocket = () => {
  if (socket) {
    socket.close();
    connected = false;
  }
};