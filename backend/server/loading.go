// File: server/server.go

package server

import (
	"WebAppFinance/modals"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

// Route handler
func LoadServer() *mux.Router {
	router := mux.NewRouter()

	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello, World!")
	})

	router.HandleFunc("/api/welcome", func(w http.ResponseWriter, r *http.Request) {
		message := modals.WelcomeMessage{Message: "Welcome to WebAppBusiness!"}
		json.NewEncoder(w).Encode(message)
	})

	//Routes
	router.Handle("/users", http.HandlerFunc(userHandler))
	router.Handle("/structure", http.HandlerFunc(structureHandler))
	router.Handle("/production", http.HandlerFunc(productionHandler))
	router.Handle("/treso", http.HandlerFunc(tresoHandler))
	router.Handle("/login", http.HandlerFunc(loginHandler))
	router.Handle("/api/getusers", http.HandlerFunc(handleGetUser))

	//Calling parameters and listenAndServe with
	server_config := ServerParameters(router, 10)
	log.Println("Starting server on :8080...")
	if err := server_config.ListenAndServe(); err != nil {
		log.Fatal(err)
	}

	return router

}
