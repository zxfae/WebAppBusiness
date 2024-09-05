package database

import (
	"database/sql"
	"fmt"
	"time"

	_ "github.com/lib/pq"
)

// Open and Check DB
func initialisation() *errorModels {
	var err error
	connStr := "postgres://plec:example@localhost:5432/business?sslmode=disable"
	db, err = sql.Open("postgres", connStr)

	if err != nil {
		return &errorModels{Error: err, Message: "Failed connect to db", Code: OpenDbFailed, Details: map[string]interface{}{"db": db}}
	}

	//Example GP
	//High
	db.SetMaxOpenConns(100)
	//Low
	db.SetMaxIdleConns(10)
	//Connection Ages
	db.SetConnMaxLifetime(time.Minute * 3)

	if err = db.Ping(); err != nil {
		return &errorModels{Error: err, Message: "Ping Db Error", Code: OpenDbFailed, Details: map[string]interface{}{"db": db}}
	}

	fmt.Println("The database is connected")
	return nil
}
