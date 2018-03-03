package main

import (
	"sync"
)

// Store is a simple key/value map
type Store struct {
	mx sync.Mutex

	m map[string]map[string]BadgeData
}

// GetLast BadgeData for provided Project and Subject
func (s *Store) GetLast(project Project, subject Subject) (BadgeData, bool) {
	s.mx.Lock()
	defer s.mx.Unlock()
	v, ok := s.m[project.toString()]
	if ok {
		v, ok := v[subject.toString()]
		return v, ok
	}
	return BadgeData{}, ok
}

// Store BadgeData to provided Project and Subject
func (s *Store) Store(project Project, subject Subject, badge BadgeData) *Store {
	s.mx.Lock()
	defer s.mx.Unlock()
	v, ok := s.m[project.toString()]
	if !ok {
		v = make(map[string]BadgeData)
		s.m[project.toString()] = v
	}
	v[subject.toString()] = badge
	return s
}

// GetProjectBadges return badges for project
func (s *Store) GetProjectBadges(project Project) (map[string]BadgeData, bool) {
	s.mx.Lock()
	defer s.mx.Unlock()
	v, ok := s.m[project.toString()]
	return v, ok
}

// NewStore creates store
func NewStore() *Store {
	return &Store{
		m: make(map[string]map[string]BadgeData),
	}
}
