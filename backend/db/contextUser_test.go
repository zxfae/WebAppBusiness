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
					return "HashPassword", nil
				}
				GenerateSessionIDFunc = func() string {
					return "UUID"
				}
				mock.ExpectBegin()
				mock.ExpectQuery(`INSERT INTO users\(userid, lastname, firstname, email, password\) VALUES \(\$1, \$2, \$3, \$4, \$5\) RETURNING id`).
					WithArgs("UUD", "Doe", "John", "john.doe@example.com", "HashPassword").
					WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(1))
				mock.ExpectCommit()
			},
			expectedID:     1,
			expectedUserId: "UUID",
			expectedError:  nil,
		},
	}

	for _, testingElement := range tests {
		t.Run(testingElement.name, func(t *testing.T) {
			testingElement.mockSetup()

			id, userId, errModels := RegisterUser(context.Background(), testingElement.user)

			if id != testingElement.expectedID {
				t.Errorf("expected id %d, got %d", testingElement.expectedID, id)
				t.Errorf("expected userId %s, got %s", testingElement.expectedUserId, userId)
			}
			if errModels != nil && errModels.Message != testingElement.expectedError.Message {
				t.Errorf("expected error message %s, got %s", testingElement.expectedError.Message, errModels.Message)
			}
		})
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}
