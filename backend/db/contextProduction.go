package database

import (
	"WebAppFinance/backend/modals"
	"context"
)

func InsertProduction(ctx context.Context, production modals.Production, productionDetial modals.ProductionDetail, prodFinanceDetails modals.ProductionFinanceDetail, userId string) (int, *errorModels) {
	trans, err := db.BeginTx(ctx, nil)
	if err != nil {
		return 0, &errorModels{Error: err, Message: "Failed to begin tx production", Code: 13}
	}
	defer trans.Rollback()

	var prodId int

	prodQuery := `
		INSERT INTO production(userId, production, gestionclient, interprofession,
		formation, entretien) VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id
	`
	err = trans.QueryRowContext(ctx,
		prodQuery,
		userId, production.Production, production.GestionClient, production.Interprofession, production.Formation, production.Entretien,
	).Scan(&prodId)
	if err != nil {
		return 0, &errorModels{Error: err, Message: "Failed to insert query to production table", Code: 14}
	}

	prodQueryDetail := `
		INSERT INTO prodDetails(prodId, productionjours, productionann)
		VALUES ($1, $2, $3)
	`
	_, err = trans.ExecContext(
		ctx,
		prodQueryDetail,
		prodId, productionDetial.Productionjours, productionDetial.Productionann,
	)

	if err != nil {
		return 0, &errorModels{Error: err, Message: "Failed to exec context at prodDetails table", Code: 15}
	}

	prodQueryFinanceDetails := `
		INSERT INTO prodFinanceDetails(prodId, tva, prixserv, cajours, caann)
		VALUES($1, $2, $3, $4, $5)
	`
	_, err = trans.ExecContext(ctx,
		prodQueryFinanceDetails,
		prodId, prodFinanceDetails.Tva, prodFinanceDetails.Prixserv, prodFinanceDetails.Cajours, prodFinanceDetails.Caann,
	)
	if err != nil {
		return 0, &errorModels{Error: err, Message: "Failed to insert query at prodDetailsFinance", Code: 16}
	}

	err = trans.Commit()
	if err != nil {
		return 0, &errorModels{Error: err, Message: "Failed to commit transaction Production", Code: 17}
	}
	return prodId, nil
}
