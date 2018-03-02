package main

import (
	"strings"
)

// Store is a simple key/value map
type Store struct {
	m map[string]map[string]BadgeData
}

func generateKey(project Project, subject Subject) string {
	return strings.Join([]string{project.toString(), subject.toString()}, ":")
}

// GetLast BadgeData for provided Project and Subject
func (s Store) GetLast(project Project, subject Subject) (BadgeData, bool) {
	v, ok := s.m[project.toString()]
	if ok {
		v, ok := v[subject.toString()]
		return v, ok
	}
	return BadgeData{}, ok
}

// Store BadgeData to provided Project and Subject
func (s Store) Store(project Project, subject Subject, badge BadgeData) Store {
	v, ok := s.m[project.toString()]
	if !ok {
		v = make(map[string]BadgeData)
		s.m[project.toString()] = v
	}
	v[subject.toString()] = badge
	return s
}

// GetProjectBadges return badges for project
func (s Store) GetProjectBadges(project Project) (map[string]BadgeData, bool) {
	v, ok := s.m[project.toString()]
	return v, ok
}

// MakeStore creates store
func MakeStore() Store {
	return Store{make(map[string]map[string]BadgeData)}
}
