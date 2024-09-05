package database

// User table
func createTableUser() *errorModels {
	query := `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            userId TEXT NOT NULL UNIQUE,
            lastname VARCHAR(100) NOT NULL,
            firstname VARCHAR(100) NOT NULL,
            email TEXT NOT NULL,
            password TEXT NOT NULL
        )
    `
	return executeQuery(query, "users")
}

// Structure tables
func createTableStructure() *errorModels {
	query := `
    CREATE TABLE IF NOT EXISTS structure(
        id SERIAL PRIMARY KEY,
        userId TEXT NOT NULL,
        name TEXT NOT NULL,
        codeape TEXT NOT NULL,
        statut TEXT NOT NULL,
        date TEXT NOT NULL,
        FOREIGN KEY(userId) REFERENCES users(userId)
    )`
	return executeQuery(query, "structure")
}
func createTableDecompteJours() *errorModels {
	query := `
    CREATE TABLE IF NOT EXISTS decompte_jours(
        id SERIAL PRIMARY KEY,
        structure_id INT NOT NULL,
        jours_annuels INT NOT NULL,
        jours_weekend INT NOT NULL,
        jours_conges_payes INT NOT NULL,
        jours_feries INT NOT NULL,
        FOREIGN KEY(structure_id) REFERENCES structure(id)
    )`
	return executeQuery(query, "decompte_jours")
}
func createTableDecompteMensuel() *errorModels {
	query := `
    CREATE TABLE IF NOT EXISTS decompte_mensuel(
        id SERIAL PRIMARY KEY,
        structure_id INT NOT NULL,
        janvier INT NOT NULL,
        fevrier INT NOT NULL,
        mars INT NOT NULL,
        avril INT NOT NULL,
        mai INT NOT NULL,
        juin INT NOT NULL,
        juillet INT NOT NULL,
        aout INT NOT NULL,
        septembre INT NOT NULL,
        octobre INT NOT NULL,
        novembre INT NOT NULL,
        decembre INT NOT NULL,
        FOREIGN KEY(structure_id) REFERENCES structure(id)
    )`
	return executeQuery(query, "decompte_mensuel")
}

func createProductionTable() *errorModels {
	query := `
    CREATE TABLE IF NOT EXISTS production(
        id SERIAL PRIMARY KEY,
        userId TEXT NOT NULL,
        production INTEGER NOT NULL,
        gestionclient INTEGER NOT NULL,
        interprofession INTEGER NOT NULL,
        formation INTEGER NOT NULL,
        entretien INTEGER NOT NULL,
        FOREIGN KEY(userId) REFERENCES users(userId)
    )
    `
	return executeQuery(query, "production")
}

func createProdDetails() *errorModels {
	query := `
    CREATE TABLE IF NOT EXISTS prodDetails(
        id SERIAL PRIMARY KEY,
        prod_id INTEGER NOT NULL,
        productionjours INTEGER NOT NULL,
        productionann INTEGER NOT NULL,
        FOREIGN KEY(prod_id) REFERENCES production(id)

    )`
	return executeQuery(query, "prodDetails")
}

func createProdFinanceDetails() *errorModels {
	query := `
    CREATE TABLE IF NOT EXISTS prodFinanceDetails(
        id SERIAL PRIMARY KEY,
        prod_id INTEGER NOT NULL,
        tva INTEGER NOT NULL,
        prixserv INTEGER NOT NULL,
        cajours INTEGER NOT NULL,
        caann INTEGER NOT NULL,
        FOREIGN KEY(prod_id) REFERENCES production(id)
    )`
	return executeQuery(query, "prodFinanceDetails")
}
