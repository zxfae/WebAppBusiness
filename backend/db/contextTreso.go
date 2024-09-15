package database

import (
	"WebAppFinance/modals"
	"context"
	"log"
)

func InsertTreso(ctx context.Context, treso modals.Treso, tresoCE modals.TresoCE, tresoFF modals.TresoFF, userId string) (int, *errorModels) {
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return 0, &errorModels{Error: err, Message: "Failed to begin tx", Code: FailedToBeginTransaction, Details: map[string]interface{}{"tx": tx}}
	}
	defer tx.Rollback()

	var tresoId int

	tresoQuery := `
		INSERT INTO ptreso(userId, sbs, cotpat, schef) VALUES($1,$2,$3,$4)
		RETURNING id
	`

	err = tx.QueryRowContext(ctx,
		tresoQuery,
		userId, treso.SalaireBrut, treso.CotPat, treso.Schef,
	).Scan(&tresoId)
	if err != nil {
		log.Printf("Error executing tresoQuery: %v", err)
		return 0, &errorModels{Error: err, Message: "Failed to exec Query T", Code: FailedToInsertQuery, Details: map[string]interface{}{"Query": tresoQuery}}
	}
	log.Printf("Inserted into treso table with ID: %d", tresoId)

	tresoCEQuery := `
		INSERT INTO ptresochargesexp(treso_id, fournitures, carburant, entretiens, fraisgen, edf, deplacement)
		VALUES($1,$2,$3,$4,$5,$6,$7)
	`
	_, err = tx.ExecContext(ctx, tresoCEQuery, tresoId, tresoCE.Fournitures, tresoCE.Carburant, tresoCE.Entretiens, tresoCE.FraisGen, tresoCE.Edf, tresoCE.Deplacement)
	if err != nil {
		log.Printf("Error executing prodQueryFinanceDetails insert: %v", err)
		return 0, &errorModels{Error: err, Message: "Failed to exec Query TCE", Code: FailedToInsertQuery, Details: map[string]interface{}{"Query": tresoCEQuery}}
	}
	log.Printf("Inserted into tresoCE table with ID: %d", tresoId)

	tresoFFQuery := `
	INSERT INTO ptresoff(treso_id, prestaext, assurc, assuraut, loyerlocaux, empruntsbanc, publicit)
	VALUES($1,$2,$3,$4,$5,$6,$7)
	`

	_, err = tx.ExecContext(ctx, tresoFFQuery, tresoId, tresoFF.Prestaext, tresoFF.Assurc, tresoFF.Assuraut, tresoFF.LL, tresoFF.Bank, tresoFF.Pub)
	if err != nil {
		log.Printf("Error executing prodQueryFinanceDetails insert: %v", err)
		return 0, &errorModels{Error: err, Message: "Failed to exec Query TCE", Code: FailedToInsertQuery, Details: map[string]interface{}{"Query": tresoCEQuery}}
	}
	log.Printf("Inserted into tresoFF table with ID: %d", tresoId)

	err = tx.Commit()
	if err != nil {
		return 0, &errorModels{Error: err, Message: "Failed to commit tx Prod", Code: FailedToCommitTx, Details: map[string]interface{}{"tx": tx}}
	}
	log.Printf("Transaction committed successfully")
	return tresoId, nil
}
