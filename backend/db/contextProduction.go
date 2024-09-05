package database

import (
	"WebAppFinance/backend/modals"
	"context"
	"log"
)

func InsertProduction(ctx context.Context, production modals.Production, productionDetail modals.ProductionDetail, prodFinanceDetails modals.ProductionFinanceDetail, userId string) (int, *errorModels) {
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return 0, &errorModels{Error: err, Message: "Failed to begin tx", Code: FailedToBeginTransaction, Details: map[string]interface{}{"tx": tx}}
	}
	defer tx.Rollback()

	var prodId int

	prodQuery := `
		INSERT INTO production(userId, production, gestionclient, interprofession,
		formation, entretien) VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id
	`
	err = tx.QueryRowContext(ctx,
		prodQuery,
		userId, production.Production, production.GestionClient, production.Interprofession, production.Formation, production.Entretien,
	).Scan(&prodId)
	if err != nil {
		log.Printf("Error executing prodQuery: %v", err)
		return 0, &errorModels{Error: err, Message: "Failed to exec Query P", Code: FailedToInsertQuery, Details: map[string]interface{}{"Query": prodQuery}}
	}

	log.Printf("Inserted into production table with ID: %d", prodId)

	prodQueryDetail := `
		INSERT INTO prodDetails(prod_id, productionjours, productionann)
		VALUES ($1, $2, $3)
	`
	_, err = tx.ExecContext(ctx, prodQueryDetail, prodId, productionDetail.Productionjours, productionDetail.Productionann)
	if err != nil {
		log.Printf("Error executing prodQueryDetail insert: %v", err)
		return 0, &errorModels{Error: err, Message: "Failed to exec Query PD", Code: FailedToInsertQuery, Details: map[string]interface{}{"Query": prodQuery}}
	}

	log.Printf("Inserted into prodDetails table")

	prodQueryFinanceDetails := `
		INSERT INTO prodFinanceDetails(prod_id, tva, prixserv, cajours, caann)
		VALUES($1, $2, $3, $4, $5)
	`
	_, err = tx.ExecContext(ctx,
		prodQueryFinanceDetails,
		prodId, prodFinanceDetails.Tva, prodFinanceDetails.Prixserv, prodFinanceDetails.Cajours, prodFinanceDetails.Caann,
	)
	if err != nil {
		log.Printf("Error executing prodQueryFinanceDetails insert: %v", err)
		return 0, &errorModels{Error: err, Message: "Failed to exec Query PFD", Code: FailedToInsertQuery, Details: map[string]interface{}{"Query": prodQuery}}
	}

	log.Printf("Inserted into prodFinanceDetails table")

	err = tx.Commit()
	if err != nil {
		return 0, &errorModels{Error: err, Message: "Failed to commit tx Prod", Code: FailedToCommitTx, Details: map[string]interface{}{"tx": tx}}
	}
	log.Printf("Transaction committed successfully")
	return prodId, nil
}
