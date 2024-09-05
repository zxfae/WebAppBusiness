// This file have all api struct
package modals

type WelcomeMessage struct {
	Message string `json:"message"`
}

// Response structure
type Response struct {
	Message string      `json:"message"`
	Code    int         `json:"code,omitempty"`
	Data    interface{} `json:"data,omitempty"`
}

type User struct {
	UserId    string `json:"userid"`
	Lastname  string `json:"lastname"`
	Firstname string `json:"firstname"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}
type Structure struct {
	Name             string          `json:"name"`
	Codeape          string          `json:"codeape"`
	Statut           string          `json:"statut"`
	Date             string          `json:"date"`
	JoursAnnuels     int             `json:"joursAnnuels"`
	JoursWeekend     int             `json:"joursWeekend"`
	JoursCongésPayés int             `json:"joursCongésPayés"`
	JoursFériés      int             `json:"joursFériés"`
	DecompteMensuel  DecompteMensuel `json:"decompteMensuel"`
}

type DecompteMensuel struct {
	Janvier   int `json:"janvier"`
	Fevrier   int `json:"fevrier"`
	Mars      int `json:"mars"`
	Avril     int `json:"avril"`
	Mai       int `json:"mai"`
	Juin      int `json:"juin"`
	Juillet   int `json:"juillet"`
	Aout      int `json:"aout"`
	Septembre int `json:"septembre"`
	Octobre   int `json:"octobre"`
	Novembre  int `json:"novembre"`
	Decembre  int `json:"decembre"`
}

type Production struct {
	Production              int                     `json:"production"`
	GestionClient           int                     `json:"gestionclient"`
	Interprofession         int                     `json:"interprofession"`
	Formation               int                     `json:"formation"`
	Entretien               int                     `json:"entretien"`
	ProductionDetail        ProductionDetail        `json:"ProductionDetail"`
	ProductionFinanceDetail ProductionFinanceDetail `json:"ProductionFinanceDetail"`
}

type ProductionDetail struct {
	Productionjours int `json:"productionjours"`
	Productionann   int `json:"productionann"`
}

type ProductionFinanceDetail struct {
	Tva      int `json:"tva"`
	Prixserv int `json:"prixserv"`
	Cajours  int `json:"cajours"`
	Caann    int `json:"caann"`
}
