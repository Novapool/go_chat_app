package main

import (
	"fmt"
	"net/http"

	"github.com/Novapool/chat-app/pkg/websocket"
	"github.com/google/uuid"
)

func serveWs(pool *websocket.Pool, w http.ResponseWriter, r *http.Request) {
	fmt.Println("WebSocket Endpoint Hit")
	conn, err := websocket.Upgrade(w, r)
	if err != nil {
		fmt.Fprintf(w, "%+v\n", err)
		return // Add this return to prevent proceeding with an error
	}

	client := &websocket.Client{
		ID:   uuid.New().String(),
		Conn: conn,
		Pool: pool,
		Send: make(chan []byte),
	}

	pool.Register <- client

	// Start both Read and Write goroutines
	go client.Write()
	client.Read()
}

func setupRoutes() {
	pool := websocket.NewPool()
	go pool.Start()

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(pool, w, r)
	})
}

func main() {
	fmt.Println("Distributed Chat App v0.01")
	setupRoutes()
	http.ListenAndServe(":8080", nil)
}
