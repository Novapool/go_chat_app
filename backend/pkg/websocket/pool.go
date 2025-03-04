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
			for client := range pool.Clients {
				fmt.Println(client)
				message := Message{Type: 1, Body: "New User Joined..."}
				messageJSON, _ := json.Marshal(message)
				client.Send <- messageJSON
			}
			break
		case client := <-pool.Unregister:
			delete(pool.Clients, client)
			fmt.Println("Size of Connection Pool: ", len(pool.Clients))
			for client := range pool.Clients {
				message := Message{Type: 1, Body: "User Disconnected..."}
				messageJSON, _ := json.Marshal(message)
				client.Send <- messageJSON
			}
			break
		case message := <-pool.Broadcast:
			fmt.Println("Sending message to all clients in Pool")
			for client := range pool.Clients {
				messageJSON, _ := json.Marshal(message)
				select {
				case client.Send <- messageJSON:
				default:
					close(client.Send)
					delete(pool.Clients, client)
				}
			}
		}
	}
}
