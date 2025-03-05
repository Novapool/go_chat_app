package websocket

import (
	"encoding/json"
	"fmt"
)

// Pool maintains the set of active clients and broadcasts messages to them
type Pool struct {
	Register   chan *Client
	Unregister chan *Client
	Clients    map[*Client]bool
	Broadcast  chan Message
}

// NewPool creates a new pool
func NewPool() *Pool {
	return &Pool{
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[*Client]bool),
		Broadcast:  make(chan Message),
	}
}

// Start begins the pool's operations
func (pool *Pool) Start() {
	for {
		select {
		case client := <-pool.Register:
			pool.Clients[client] = true
			fmt.Println("Size of Connection Pool: ", len(pool.Clients))

			// Create personalized join message
			joinMessage := Message{
				Type:   1,
				Body:   "has joined the chat",
				Sender: "System",
			}
			joinMessageJSON, _ := json.Marshal(joinMessage)

			// Send to all clients
			for otherClient := range pool.Clients {
				otherClient.Send <- joinMessageJSON
			}
		case client := <-pool.Unregister:
			delete(pool.Clients, client)
			fmt.Println("Size of Connection Pool: ", len(pool.Clients))
			for otherClient := range pool.Clients {
				message := Message{
					Type:   1,
					Body:   "has left the chat",
					Sender: "System",
				}
				messageJSON, _ := json.Marshal(message)
				otherClient.Send <- messageJSON
			}
		case message := <-pool.Broadcast:
			fmt.Printf("Sending message to all clients in Pool (%d clients)\n", len(pool.Clients))
			for otherClient := range pool.Clients {
				messageJSON, _ := json.Marshal(message)
				select {
				case otherClient.Send <- messageJSON:
				default:
					close(otherClient.Send)
					delete(pool.Clients, otherClient)
				}
			}
		}
	}
}
