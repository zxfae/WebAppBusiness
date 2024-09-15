package database

import (
	"WebAppFinance/modals"
	"context"
)

func InsertStructure(ctx context.Context, structure modals.Structure, userId string) (int, *errorModels) {

	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return 0, &errorModels{Error: err, Message: "Failed to begin tx", Code: FailedToBeginTransaction, Details: map[string]interface{}{"tx": tx}}
	}
	defer tx.Rollback()

	var structureId int
	structureQuery := `
        INSERT INTO structure(userId, name, codeape, statut, date) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING id
    `
	err = tx.QueryRowContext(
		ctx,
		structureQuery,
		userId, structure.Name, structure.Codeape, structure.Statut, structure.Date,
	).Scan(&structureId)
	if err != nil {
		return 0, &errorModels{Error: err, Message: "Failed to exec context S", Code: FailedToInsertQuery, Details: map[string]interface{}{"Query": structureQuery}}
	}

	decompteJoursQuery := `
        INSERT INTO decompte_jours(structure_id, jours_annuels, jours_weekend, jours_conges_payes, jours_feries)
        VALUES ($1, $2, $3, $4, $5)
    `
	_, err = tx.ExecContext(
		ctx,
		decompteJoursQuery,
		structureId, structure.JoursAnnuels, structure.JoursWeekend, structure.JoursCongésPayés, structure.JoursFériés,
	)
	if err != nil {
		return 0, &errorModels{Error: err, Message: "Failed to exec context DJ", Code: FailedToInsertQuery, Details: map[string]interface{}{"Query": decompteJoursQuery}}
	}

	decompteMensuelQuery := `
        INSERT INTO decompte_mensuel(
            structure_id, janvier, fevrier, mars, avril, mai, juin, 
            juillet, aout, septembre, octobre, novembre, decembre
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    `
	_, err = tx.ExecContext(
		ctx,
		decompteMensuelQuery,
		structureId,
		structure.DecompteMensuel.Janvier, structure.DecompteMensuel.Fevrier, structure.DecompteMensuel.Mars,
		structure.DecompteMensuel.Avril, structure.DecompteMensuel.Mai, structure.DecompteMensuel.Juin,
		structure.DecompteMensuel.Juillet, structure.DecompteMensuel.Aout, structure.DecompteMensuel.Septembre,
		structure.DecompteMensuel.Octobre, structure.DecompteMensuel.Novembre, structure.DecompteMensuel.Decembre,
	)
	if err != nil {
		return 0, &errorModels{Error: err, Message: "Failed to exec context DM", Code: FailedToInsertQuery, Details: map[string]interface{}{"Query": decompteMensuelQuery}}
	}

	err = tx.Commit()
	if err != nil {
		return 0, &errorModels{Error: err, Message: "Failed to commit tx S", Code: FailedToCommitTx, Details: map[string]interface{}{"tx": tx}}
	}
	return structureId, nil
}
