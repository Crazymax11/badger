package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"sort"
	"strings"

	"github.com/gorilla/mux"
)

func main() {
	router := mux.NewRouter()
	store := NewStore()
	router.HandleFunc("/badges/{project}/json", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		project := makeProject(vars["project"])

		badges, ok := store.GetProjectBadges(project)

		if !ok {
			message := fmt.Sprintf("No badges for project: %s", project)
			log.Print(message)
			w.Write([]byte(message))
			http.NotFound(w, r)
			return
		}
		json, err := json.Marshal(badges)
		if err != nil {
			message := fmt.Sprintf("Error json badges: %v", err)
			log.Print(message)
			http.Error(w, message, http.StatusBadRequest)
			return
		}

		w.Write([]byte(json))
	}).Methods("GET")

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
			message := fmt.Sprintf("Error reading body: %v", err)
			log.Print(message)
			http.Error(w, message, http.StatusBadRequest)
			return
		}

		var badge BadgeData
		unmarshalError := json.Unmarshal(body, &badge)
		if unmarshalError != nil {
			message := fmt.Sprintf("Error reading body: %v", unmarshalError)
			log.Print(message)
			http.Error(w, message, http.StatusBadRequest)
			return
		}

		store.Store(project, subject, badge)
	}).Methods("POST")

	router.HandleFunc("/badges/{project}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		project := makeProject(vars["project"])

		badges, ok := store.GetProjectBadges(project)

		if !ok {
			message := fmt.Sprintf("No badges for project: %s", project)
			log.Print(message)
			w.Write([]byte(message))
			http.NotFound(w, r)
			return
		}

		html := []string{"<html><body><table>"}

		var subjects []string
		for k := range badges {
			subjects = append(subjects, k)
		}
		sort.Strings(subjects)

		for _, subject := range subjects {
			badge := badges[subject]
			str := fmt.Sprintf("<tr><td><img src=\"%s\"></td><td><span> subject: %s </span></td></tr>", badge.GetUrl(), subject)
			html = append(html, str)
		}

		html = append(html, "</table></body></html>")
		body := strings.Join(html, "")
		w.Write([]byte(body))
	}).Methods("GET")

	http.Handle("/", router)
	log.Println("Started")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
