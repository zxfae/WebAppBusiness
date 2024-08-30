package server

import (
	"WebAppFinance/backend/modals"
	"encoding/json"
	"log"
	"net/http"
)

func handleError(w http.ResponseWriter, err error, message string, code int) {
	log.Printf("%s: %v", message, err)
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(modals.Response{
		Message: message,
		Code:    code,
	})
}
