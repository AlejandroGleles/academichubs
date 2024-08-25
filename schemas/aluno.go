package schemas

import (
	"time"

	"gorm.io/gorm"
)

type Aluno struct {
	gorm.Model
	Nome      string  `json:"nome"`
	Matricula int     `json:"matricula"`
	Turmas    []Turma `gorm:"many2many:turma_aluno;"` // Relacionamento muitos-para-muitos
}

type AlunoResponse struct {
	ID        uint       `json:"id"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `json:"deletedAt,omitempty"`
	Nome      string     `json:"nome"`
	Matricula int        `json:"matricula"`
	Turmas    []Turma    `json:"turmas"` // Incluir turmas associadas no response
}
