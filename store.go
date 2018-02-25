package main

import (
	"strings"
)

// Store is a simple key/value map
type Store struct {
	m map[string]BadgeData
}

func generateKey(project Project, subject Subject) string {
	return strings.Join([]string{project.toString(), subject.toString()}, ":")
}

// GetLast BadgeData for provided Project and Subject
func (s Store) GetLast(project Project, subject Subject) (BadgeData, bool) {
	key := generateKey(project, subject)
	v, ok := s.m[key]
	return v, ok
}

// Store BadgeData to provided Project and Subject
func (s Store) Store(project Project, subject Subject, badge BadgeData) Store {
	key := generateKey(project, subject)
	s.m[key] = badge
	return s
}

// MakeStore creates store
func MakeStore() Store {
	return Store{make(map[string]BadgeData)}
}
