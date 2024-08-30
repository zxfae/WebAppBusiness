package server

import (
	database "WebAppFinance/backend/db"
	"WebAppFinance/backend/modals"
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"time"
)

var sessionManager *SessionManager

func init() {
	sessionManager = NewSessionManager()
}

func userHandler(w http.ResponseWriter, r *http.Request) {
	//Method must be POST. check method
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	//Encode the response
	var user modals.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}
	//Insert to user table if ok
	userID, userId, errModel := database.RegisterUser(r.Context(), user)
	if errModel != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(modals.Response{
			Message: errModel.Message,
			Code:    errModel.Code,
		})
		return
	}
	//Create a sessionCookie
	sessionID, cookie := sessionManager.CreateSession(userId)
	http.SetCookie(w, cookie)
	//Set content-type header, write code 201
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(modals.Response{
		Message: "User created successfully",
		Data: map[string]interface{}{
			"userId":    userID,
			"sessionId": sessionID,
		},
	})
}

// Insert structure json at
func structureHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Received request to structureHandler")

	//Method must be POST. check method
	if r.Method != http.MethodPost {
		handleError(w, nil, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}
	//Get and validate the session cookie
	cookie, err := r.Cookie("session_id")
	if err != nil {
		handleError(w, err, "Unauthorized: No session cookie", http.StatusUnauthorized)
		return
	}
	sessionID := cookie.Value
	log.Printf("Session ID: %s", sessionID)

	//Check if session exist
	sessionManager.mutex.Lock()
	session, exists := sessionManager.sessions[sessionID]
	sessionManager.mutex.Unlock()

	if !exists {
		log.Printf("Session not found for ID: %s", sessionID)
		handleError(w, nil, "Unauthorized: Invalid or expired session", http.StatusUnauthorized)
		return
	}

	if time.Now().After(session.Expiry) {
		log.Printf("Session expired for ID: %s, Expiry: %v", sessionID, session.Expiry)
		handleError(w, nil, "Unauthorized: Invalid or expired session", http.StatusUnauthorized)
		return
	}
	//Read request body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		handleError(w, err, "Error reading request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	log.Printf("Request body: %s", string(body))
	r.Body = io.NopCloser(bytes.NewBuffer(body))

	var structure modals.Structure
	//Decode json payload
	if err := json.NewDecoder(r.Body).Decode(&structure); err != nil {
		handleError(w, err, "Invalid request payload", http.StatusBadRequest)
		return
	}
	//Debug
	log.Printf("Decoded structure: %+v", structure)

	// Check if the user existence before inserting the structure
	userExists, err := database.CheckUserExists(r.Context(), session.UserID)
	if err != nil || !userExists {
		log.Printf("Error checking user existence for ID: %s", session.UserID)
		handleError(w, err, "Invalid user ID: User does not exist", http.StatusBadRequest)
		return
	}
	//If all check ok, insert to the structure
	structureID, errModel := database.InsertStructure(r.Context(), structure, session.UserID)
	if errModel != nil {
		handleError(w, errModel.Error, "Failed to insert structure", http.StatusInternalServerError)
		return
	}
	log.Printf("Structure created successfully with ID: %d", structureID)

	//Set the content-type header and create status code 201
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	//Encode the response data as format JSON
	json.NewEncoder(w).Encode(modals.Response{
		Message: "Structure created successfully",
		Data: map[string]interface{}{
			"structureId": structureID,
		},
	})
}
