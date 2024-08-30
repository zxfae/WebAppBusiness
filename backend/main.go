package main

import (
	database "WebAppFinance/backend/db"
	"WebAppFinance/backend/server"
)

func main() {
	database.SetupDatabase()
	server.LoadServer()
}
