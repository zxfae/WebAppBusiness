package database

// Execute all tables
func SetupDatabase() *errorModels {
	if err := initialisation(); err != nil {
		return err
	}

	createAllTables()

	return nil
}
