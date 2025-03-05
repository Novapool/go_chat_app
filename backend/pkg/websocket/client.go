package websocket

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/gorilla/websocket"
)

// Client represents a single chatting user
type Client struct {
	ID   string
	Conn *websocket.Conn
	Pool *Pool
	Send chan []byte
}

// Message represents a message sent between users
type Message struct {
	Type      int    `json:"type"`
	Body      string `json:"body"`
	Sender    string `json:"sender,omitempty"`
	Recipient string `json:"recipient,omitempty"`
}

// Read pumps messages from the WebSocket connection to the Pool
func (c *Client) Read() {
	defer func() {
		c.Pool.Unregister <- c
		c.Conn.Close()
	}()

	for {
		_, p, err := c.Conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}

		// Parse the incoming JSON message
		var receivedMsg Message
		if err := json.Unmarshal(p, &receivedMsg); err != nil {
			log.Println("Error parsing message:", err)
			continue
		}

		// Forward the parsed message to the pool
		c.Pool.Broadcast <- receivedMsg
		fmt.Printf("Message Received: %+v\n", receivedMsg)
	}
}

// Write pumps messages from the Send channel to the WebSocket connection
func (c *Client) Write() {
	defer func() {
		c.Conn.Close()
	}()

	for message := range c.Send {
		if err := c.Conn.WriteMessage(websocket.TextMessage, message); err != nil {
			return
		}
	}

	// Send close message when channel is closed
	c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
}
