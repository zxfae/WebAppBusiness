package server

import (
	database "WebAppFinance/db"
	"WebAppFinance/modals"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"
)

var sessionManager *SessionManager

func init() {
	sessionManager = NewSessionManager()
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	// Only allow POST requests
	if r.Method != http.MethodPost {
		w.Header().Set("Content-Type", "application/json")
		http.Error(w, `{"message": "Invalid request method"}`, http.StatusMethodNotAllowed)
		return
	}

	var user modals.User
	// Decode the user credentials from the request body
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		w.Header().Set("Content-Type", "application/json")
		http.Error(w, `{"message": "Invalid request payload"}`, http.StatusBadRequest)
		return
	}

	// Call LoginUser to verify credentials
	ok, err := database.LoginUser(ctx, user)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		http.Error(w, fmt.Sprintf(`{"message": "%s"}`, err.Message), http.StatusUnauthorized)
		return
	}

	// Check if the login was successful (e.g., check if user exists)
	if ok == 0 {
		w.Header().Set("Content-Type", "application/json")
		http.Error(w, `{"message": "Invalid credentials"}`, http.StatusUnauthorized)
		return
	}

	// Create a session if the login was successful
	sessionID, _ := sessionManager.CreateSession(w, "userID")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message":"Login successful", "session_id":"` + sessionID + `"}`))

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
	sessionID, _ := sessionManager.CreateSession(w, userId)
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
func productionHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Received request to productionHandler")

	// Method must be POST. Check method
	if r.Method != http.MethodPost {
		handleError(w, nil, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Get and validate the session cookie
	cookie, err := r.Cookie("session_id")
	if err != nil {
		handleError(w, err, "Unauthorized: No session cookie", http.StatusUnauthorized)
		return
	}
	sessionID := cookie.Value
	log.Printf("Session ID: %s", sessionID)

	// Check if session exists and is valid
	sessionManager.mutex.Lock()
	session, exists := sessionManager.sessions[sessionID]
	sessionManager.mutex.Unlock()

	if !exists || time.Now().After(session.Expiry) {
		log.Printf("Session not found or expired for ID: %s", sessionID)
		handleError(w, nil, "Unauthorized: Invalid or expired session", http.StatusUnauthorized)
		return
	}

	// Read request body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		handleError(w, err, "Error reading request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	log.Printf("Request body: %s", string(body))
	r.Body = io.NopCloser(bytes.NewBuffer(body))

	// Decode JSON payload into Production struct
	var prod modals.Production
	if err := json.NewDecoder(r.Body).Decode(&prod); err != nil {
		handleError(w, err, "Invalid request payload", http.StatusBadRequest)
		return
	}
	log.Printf("Decoded production: %+v", prod)

	// Get production details and finance details from the decoded production
	productionDetail := prod.ProductionDetail
	prodFinanceDetails := prod.ProductionFinanceDetail

	// Log the production details and finance details
	log.Printf("ProductionDetail: %+v", productionDetail)
	log.Printf("ProductionFinanceDetail: %+v", prodFinanceDetails)

	// Check if the user exists before inserting the production
	userExists, err := database.CheckUserExists(r.Context(), session.UserID)
	if err != nil || !userExists {
		log.Printf("Error checking user existence for ID: %s", session.UserID)
		handleError(w, err, "Invalid user ID: User does not exist", http.StatusBadRequest)
		return
	}

	// Insert the production into the database
	productionID, errModel := database.InsertProduction(r.Context(), prod, productionDetail, prodFinanceDetails, session.UserID)
	if errModel != nil {
		handleError(w, errModel.Error, "Failed to insert production", http.StatusInternalServerError)
		return
	}
	log.Printf("Production created successfully with ID: %d", productionID)

	// Set the content-type header and return a successful response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(modals.Response{
		Message: "Production created successfully",
		Data: map[string]interface{}{
			"productionId": productionID,
		},
	})
}

func tresoHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Received request to tresoHandler")

	// Method must be POST. Check method
	if r.Method != http.MethodPost {
		handleError(w, nil, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	// Get and validate the session cookie
	cookie, err := r.Cookie("session_id")
	if err != nil {
		handleError(w, err, "Unauthorized: No session cookie", http.StatusUnauthorized)
		return
	}
	sessionID := cookie.Value
	log.Printf("Session ID: %s", sessionID)

	// Check if session exists and is valid
	sessionManager.mutex.Lock()
	session, exists := sessionManager.sessions[sessionID]
	sessionManager.mutex.Unlock()

	if !exists || time.Now().After(session.Expiry) {
		log.Printf("Session not found or expired for ID: %s", sessionID)
		handleError(w, nil, "Unauthorized: Invalid or expired session", http.StatusUnauthorized)
		return
	}

	// Read request body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		handleError(w, err, "Error reading request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	log.Printf("Request body: %s", string(body))
	r.Body = io.NopCloser(bytes.NewBuffer(body))

	// Decode JSON payload into treso struct
	var treso modals.Treso
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&treso); err != nil {
		handleError(w, err, "Invalid request payload", http.StatusBadRequest)
		return
	}
	log.Printf("Decoded treso: %+v", treso)

	// Get tresoCE && tresoFF details from the decoded treso
	tresoCE := treso.TresoCE
	tresoFF := treso.TresoFF

	// Log
	log.Printf("TresoCE: %+v", tresoCE)
	log.Printf("TresoFF: %+v", tresoFF)

	// Check if the user exists before inserting the production
	userExists, err := database.CheckUserExists(r.Context(), session.UserID)
	if err != nil || !userExists {
		log.Printf("Error checking user existence for ID: %s", session.UserID)
		handleError(w, err, "Invalid user ID: User does not exist", http.StatusBadRequest)
		return
	}

	// Insert the treso into the database
	tresoID, errModel := database.InsertTreso(r.Context(), treso, tresoCE, tresoFF, session.UserID)
	if errModel != nil {
		handleError(w, errModel.Error, "Failed to insert treso", http.StatusInternalServerError)
		return
	}
	log.Printf("treso created successfully with ID: %d", tresoID)

	// Set the content-type header and return a successful response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(modals.Response{
		Message: "treso created successfully",
		Data: map[string]interface{}{
			"tresoId": tresoID,
		},
	})
}
