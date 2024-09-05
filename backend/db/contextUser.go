package database

import (
	"WebAppFinance/backend/modals"
	"context"

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
		return 0, &errorModels{Error: err, Message: "Failed to login", Code: ErrFailedToLogin, Details: map[string]interface{}{"Email": user.Email}}
	}

	//Compare the password and hashed password in the db
	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(user.Password))
	if err != nil {
		//Debug to term
		//log.Printf("Invalid credentials for user %s: %v", user.Email, err)
		return 0, &errorModels{Error: err, Message: "Invalid credentials", Code: ErrInvalidPassword, Details: map[string]interface{}{"Password": user.Password}}
	}

	//return 1 if ok
	return 1, nil
}

func RegisterUser(ctx context.Context, user modals.User) (int, string, *errorModels) {
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return 0, "", &errorModels{Error: err, Message: "Failed to begin tx", Code: FailedToBeginTransaction, Details: map[string]interface{}{"tx": tx}}
	}
	defer tx.Rollback()

	hshPwd, err := HashPasswordFunc(user.Password)
	if err != nil {
		return 0, "", &errorModels{Error: err, Message: "Failed create pwd", Code: FailedToInsertQuery, Details: map[string]interface{}{"pwd": hshPwd}}
	}

	userId := GenerateSessionIDFunc()
	var userID int
	userQuery := `INSERT INTO users(userid, lastname, firstname, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING id`
	err = tx.QueryRowContext(ctx, userQuery, userId, user.Lastname, user.Firstname, user.Email, hshPwd).Scan(&userID)
	if err != nil {
		return 0, "", &errorModels{Error: err, Message: "Failed to exec Context U", Code: FailedToInsertQuery, Details: map[string]interface{}{"Query": userQuery}}
	}

	err = tx.Commit()
	if err != nil {
		return 0, "", &errorModels{Error: err, Message: "Failed to commit tx User", Code: FailedToCommitTx, Details: map[string]interface{}{"tx": tx}}
	}

	return userID, userId, nil
}
