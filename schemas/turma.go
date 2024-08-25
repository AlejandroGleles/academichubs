package schemas

import (
	"time"

	"gorm.io/gorm"
)

type Turma struct {
	gorm.Model
	Nome        string  `json:"nome"`
	Semestre    string  `json:"semestre"`
	Ano         string  `json:"ano"`
	ProfessorID uint    `json:"professorId"`
	Alunos      []Aluno `gorm:"many2many:turma_aluno;"`
}

type TurmaResponse struct {
	ID          uint       `json:"id"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
	DeletedAt   *time.Time `json:"deletedAt,omitempty"`
	Nome        string     `json:"nome"`
	Semestre    string     `json:"semestre"`
	Ano         string     `json:"ano"`
	ProfessorID uint       `json:"professorId"`
}
