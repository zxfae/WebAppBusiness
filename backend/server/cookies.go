package server

import (
	database "WebAppFinance/backend/db"
	"net/http"
	"time"
)

// Create newSession manager
func NewSessionManager() *SessionManager {
	return &SessionManager{
		sessions: make(map[string]Session),
	}
}

// Return new session ID and cookie
func (sm *SessionManager) CreateSession(userid string) (string, *http.Cookie) {
	sm.InvalidateSession(userid)
	sm.mutex.Lock()
	defer sm.mutex.Unlock()
	//Create session with UUID
	sessionID := database.GenerateSessionID()
	//New cookie expiration 24h
	expiry := time.Now().Add(24 * time.Hour)

	//Create new user Session struct with
	// => UUID id && expiration Time
	sm.sessions[sessionID] = Session{
		UserID: userid,
		Expiry: expiry,
	}
	//Create HTTP cookie with parameters ....
	cookie := &http.Cookie{
		Name:     "session_id",
		Value:    sessionID,
		Expires:  expiry,
		HttpOnly: true,
		Path:     "/",
		SameSite: http.SameSiteStrictMode,
	}

	return sessionID, cookie
}

func (sm *SessionManager) InvalidateSession(userid string) {
	sm.mutex.Lock()
	defer sm.mutex.Unlock()

	for id, session := range sm.sessions {
		if session.UserID == userid {
			//Delete from the map the cookie userid are changed
			delete(sm.sessions, id)
			return
		}
	}
}

// Check if session's valide and has not expired
func (sm *SessionManager) ValidateSession(sessionID string) (*Session, bool) {
	sm.mutex.Lock()
	defer sm.mutex.Unlock()

	//get session by ID
	session, exists := sm.sessions[sessionID]
	//check if cookieSession has expired it removes it from session map
	if !exists || session.Expiry.Before(time.Now()) {
		if exists {
			delete(sm.sessions, sessionID)
		}
		//Session invalide return =>
		return nil, false
	}
	//Session valide return =>
	return &session, true
}

// logout function, delete session
func (sm *SessionManager) DeleteSession(sessionID string) {
	sm.mutex.Lock()
	defer sm.mutex.Unlock()
	delete(sm.sessions, sessionID)
}

func (sm *SessionManager) CleanupExpiredSessions(interval time.Duration) {
	for {
		time.Sleep(interval)
		sm.mutex.Lock()
		for id, session := range sm.sessions {
			if session.Expiry.Before(time.Now()) {
				//Session has expired ? delete =>
				delete(sm.sessions, id)
			}
		}
		sm.mutex.Unlock()
	}
}
