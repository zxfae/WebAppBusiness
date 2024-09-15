package main

import (
	database "WebAppFinance/db"
	"WebAppFinance/server"
)

func main() {
	database.SetupDatabase()
	server.LoadServer()
}
