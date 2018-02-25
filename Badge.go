package main

import (
	"fmt"
	"strings"
)

type Project string
type Subject string
type BadgeData struct {
	Color   string  `json:"color"`
	Subject Subject `json:"subject"`
	Status  string  `json:"status"`
}

func (p Project) toString() string {
	return string(p)
}

func (s Subject) toString() string {
	return string(s)
}

func makeProject(str string) Project {
	return Project(str)
}

func makeSubject(str string) Subject {
	return Subject(str)
}

func makeNotFoundBadge(s Subject) BadgeData {
	return BadgeData{"gray", s, "not found"}
}

func (b BadgeData) GetUrl() string {
	status := strings.Replace(b.Status, "-", "--", -1)
	status = strings.Replace(status, "_", "__", -1)
	status = strings.Replace(status, " ", "_", -1)

	subject := strings.Replace(b.Subject.toString(), "-", "--", -1)
	subject = strings.Replace(subject, "_", "__", -1)
	subject = strings.Replace(subject, " ", "_", -1)

	return fmt.Sprintf("https://img.shields.io/badge/%s-%s-%s.svg", subject, status, b.Color)
}
