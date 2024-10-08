package database

import (
	"context"
	"crypto/rand"
	"database/sql"
	"encoding/base64"
	"fmt"
	"log"

	"golang.org/x/crypto/bcrypt"
)

var db *sql.DB

// Struct error
type errorModels struct {
	Error   error
	Message string
	Code    int
	Details map[string]interface{}
}

// Const for errorModels, Code.
const (
	ErrFailedToLogin         = 1
	ErrInvalidPassword       = 2
	FailedToBeginTransaction = 3
	FailedToInsertQuery      = 4
	FailedToCommitTx         = 5
	CreateHashPassword       = 6
	TableCreationError       = 7
	OpenDbFailed             = 8
	PingDbFailed             = 9
	QueryExecFailed          = 10
	FailedToFetch            = 11
	ErrUserNotFound          = 12
)

// UnitTest
var (
	GenerateSessionIDFunc = GenerateSessionID
	HashPasswordFunc      = HashPassword
)

func GenerateSessionID() string {
	b := make([]byte, 32)
	rand.Read(b)
	return base64.URLEncoding.EncodeToString(b)
}

func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

// Verification already not used
func CheckEmailExists(ctx context.Context, email string) (bool, error) {
	query := "SELECT COUNT(*) FROM Users WHERE email = ?"
	var count int
	err := db.QueryRowContext(ctx, query, email).Scan(&count)
	if err != nil {
		return false, fmt.Errorf("failed to execute query: %w", err)
	}
	return count > 0, nil
}

// Check if user exist,
// Necessary to handle handler(handling.go) affiliate session
func CheckUserExists(ctx context.Context, userId string) (bool, error) {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM users WHERE userId = $1)`

	err := db.QueryRowContext(ctx, query, userId).Scan(&exists)
	if err != nil {
		log.Printf("Error checking user existence: %v", err)
		return false, err
	}

	return exists, nil
}
