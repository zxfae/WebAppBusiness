package database

// Execute all tables
func SetupDatabase() *errorModels {
	initialisation()
	createAllTables()
	return nil
}
