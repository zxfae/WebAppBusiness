package database

import (
	"context"
	"testing"

	"WebAppFinance/backend/modals"

	"github.com/DATA-DOG/go-sqlmock"
)

func TestRegisterUser(t *testing.T) {
	originalDB := db
	originalGenerateSessionID := GenerateSessionIDFunc
	originalHashPassword := HashPasswordFunc

	mockDB, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("failed to open mock database: %v", err)
	}
	defer mockDB.Close()

	defer func() {
		db = originalDB
		GenerateSessionIDFunc = originalGenerateSessionID
		HashPasswordFunc = originalHashPassword
	}()

	db = mockDB

	tests := []struct {
		name           string
		user           modals.User
		mockSetup      func()
		expectedID     int
		expectedUserId string
		expectedError  *errorModels
	}{
		{
			name: "Successful registration",
			user: modals.User{
				Lastname:  "Doe",
				Firstname: "John",
				Email:     "john.doe@example.com",
				Password:  "password123",
			},
			mockSetup: func() {
				HashPasswordFunc = func(password string) (string, error) {
					return "mockHashedPassword", nil
				}
				GenerateSessionIDFunc = func() string {
					return "generated-uuid"
				}
				mock.ExpectBegin()
				mock.ExpectQuery(`INSERT INTO users\(userid, lastname, firstname, email, password\) VALUES \(\$1, \$2, \$3, \$4, \$5\) RETURNING id`).
					WithArgs("generated-uuid", "Doe", "John", "john.doe@example.com", "mockHashedPassword").
					WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(1))
				mock.ExpectCommit()
			},
			expectedID:     1,
			expectedUserId: "generated-uuid",
			expectedError:  nil,
		},
		// Add other test cases here
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.mockSetup()

			id, userId, errModels := RegisterUser(context.Background(), tt.user)

			if id != tt.expectedID {
				t.Errorf("expected id %d, got %d", tt.expectedID, id)
			}
			if userId != tt.expectedUserId {
				t.Errorf("expected userId %s, got %s", tt.expectedUserId, userId)
			}
			if errModels != nil && errModels.Message != tt.expectedError.Message {
				t.Errorf("expected error message %s, got %s", tt.expectedError.Message, errModels.Message)
			}
		})
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}
