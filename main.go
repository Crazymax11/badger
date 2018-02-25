package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	router := mux.NewRouter()
	store := MakeStore()
	router.HandleFunc("/badges/{project}/{subject}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		project := makeProject(vars["project"])
		subject := makeSubject(vars["subject"])
		badgeData, ok := store.GetLast(project, subject)
		if !ok {
			log.Printf("Badge not found for project %s and subject %s", project, subject)
			badgeData = makeNotFoundBadge(subject)
		}
		badgeURL := badgeData.GetUrl()
		http.Redirect(w, r, badgeURL, 302)
	}).Methods("GET")

	router.HandleFunc("/badges/{project}/{subject}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		project := makeProject(vars["project"])
		subject := makeSubject(vars["subject"])
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			log.Printf("Error reading body: %v", err)
			http.Error(w, "can't read body", http.StatusBadRequest)
			return
		}

		var badge BadgeData
		unmarshalError := json.Unmarshal(body, &badge)
		if unmarshalError != nil {
			log.Printf("Error reading body: %v", unmarshalError)
			http.Error(w, "can't read body", http.StatusBadRequest)
			return
		}

		store.Store(project, subject, badge)
	}).Methods("POST")
	http.Handle("/", router)
	log.Println("Started")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
