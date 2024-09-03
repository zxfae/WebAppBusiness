package database

import "fmt"

func executeQuery(query string, tableName string) *errorModels {
	_, err := db.Exec(query)
	if err != nil {
		fmt.Printf("Erreur lors de la création de la table %s: %v\n", tableName, err)
		return &errorModels{Error: err, Message: fmt.Sprintf("Échec de la création de la table %s", tableName), Code: 2}
	}
	return nil
}

func createAllTables() *errorModels {
	tables := []func() *errorModels{
		createTableUser,
		createTableStructure,
		createTableDecompteJours,
		createTableDecompteMensuel,
		createProductionTable,
		createProductionTable,
		createProdDetails,
		createProdFinanceDetails,
	}

	for _, table := range tables {
		if err := table(); err != nil {
			return err
		}
	}

	fmt.Println("Toutes les tables ont été créées avec succès")
	return nil
}
