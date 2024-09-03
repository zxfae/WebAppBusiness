// File: server/server.go

package server

import (
	database "WebAppFinance/backend/db"
	"WebAppFinance/backend/modals"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

// Route handler
func LoadServer() *mux.Router {
	router := mux.NewRouter()

	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello, World!")
	})

	router.HandleFunc("/api/welcome", func(w http.ResponseWriter, r *http.Request) {
		message := modals.WelcomeMessage{Message: "Bienvenue sur mon serveur Go!"}
		json.NewEncoder(w).Encode(message)
	})

	router.Handle("/users", http.HandlerFunc(userHandler))
	router.Handle("/structure", http.HandlerFunc(structureHandler))
	router.Handle("/production", http.HandlerFunc(productionHandler))

	router.HandleFunc("/login", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
		defer cancel()

		if r.Method == http.MethodPost {
			var user modals.User
			if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
				w.Header().Set("Content-Type", "application/json")
				http.Error(w, `{"message": "Invalid request payload"}`, http.StatusBadRequest)
				return
			}
			//Caling LoginUser
			ok, err := database.LoginUser(ctx, user)
			if err != nil {
				w.Header().Set("Content-Type", "application/json")
				http.Error(w, `{"message": "`+err.Message+`"}`, http.StatusUnauthorized)
				return
			}
			//!= 1 return func bad password
			if ok == 0 {
				w.Header().Set("Content-Type", "application/json")
				http.Error(w, `{"message": "Invalid credentials"}`, http.StatusUnauthorized)
				return
			}
			//If ok, session created
			sessionID, sessionCookie := sessionManager.CreateSession(user.Email)
			http.SetCookie(w, sessionCookie)

			//Debug
			w.Header().Set("Content-Type", "application/json")
			fmt.Fprintf(w, `{"message": "User %s successfully logged in with session ID %s"}`, user.Email, sessionID)
		} else {
			w.Header().Set("Content-Type", "application/json")
			http.Error(w, `{"message": "Invalid request method"}`, http.StatusMethodNotAllowed)
		}
	})).Methods("POST")

	//Calling parameters and listenAndServe with
	server_config := ServerParameters(router, 10)
	log.Println("Starting server on :8080...")
	if err := server_config.ListenAndServe(); err != nil {
		log.Fatal(err)
	}

	return router

}
