package websocket

import (
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
		messageType, p, err := c.Conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		message := Message{Type: messageType, Body: string(p), Sender: c.ID}
		c.Pool.Broadcast <- message
		fmt.Printf("Message Received: %+v\n", message)
	}
}
