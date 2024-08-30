package server

import (
	"sync"
	"time"
)

// That's user Session structure
type Session struct {
	UserID string
	Expiry time.Time
}

// Session manager structure
type SessionManager struct {
	//Map of session with IDs keys
	sessions map[string]Session
	//Mutex for handle concurrent access to session map
	mutex sync.Mutex
}
