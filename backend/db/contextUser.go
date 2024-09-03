package database

import (
	"WebAppFinance/backend/modals"
	"context"
	"log"

	"golang.org/x/crypto/bcrypt"
)

// Authentification, checking email and password
// OK ? return userId , != ok return failed
func LoginUser(ctx context.Context, user modals.User) (int, *errorModels) {
	var hashedPassword string
	//Query to db
	query := "SELECT password FROM users WHERE email = $1"

	err := db.QueryRowContext(ctx, query, user.Email).Scan(&hashedPassword)
	if err != nil {
		log.Printf("Error querying user: %v", err)
		return 0, &errorModels{Error: err, Message: "Failed to login User", Code: 7}
	}

	log.Printf("Hashed password retrieved for user %s: %s", user.Email, hashedPassword)
	//Compare the password and hashed password in the db
	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(user.Password))
	if err != nil {
		log.Printf("Invalid credentials for user %s: %v", user.Email, err)
		return 0, &errorModels{Error: err, Message: "Invalid credentials", Code: 8}
	}
	//debug
	log.Printf("User %s logged in successfully", user.Email)
	//return 1 if ok
	return 1, nil
}

func RegisterUser(ctx context.Context, user modals.User) (int, string, *errorModels) {
	transaction, err := db.BeginTx(ctx, nil)
	if err != nil {
		return 0, "", &errorModels{Error: err, Message: "Failed to begin transaction user", Code: 3}
	}
	defer transaction.Rollback()

	hashedPassword, err := HashPasswordFunc(user.Password)
	if err != nil {
		return 0, "", &errorModels{Error: err, Message: "Failed to create password hash", Code: 4}
	}

	userId := GenerateSessionIDFunc()
	var userID int
	userQuery := `INSERT INTO users(userid, lastname, firstname, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING id`
	err = transaction.QueryRowContext(ctx, userQuery, userId, user.Lastname, user.Firstname, user.Email, hashedPassword).Scan(&userID)
	if err != nil {
		return 0, "", &errorModels{Error: err, Message: "Failed to insert user and retrieve ID", Code: 5}
	}

	err = transaction.Commit()
	if err != nil {
		return 0, "", &errorModels{Error: err, Message: "Failed to commit transaction user", Code: 6}
	}

	return userID, userId, nil
}
