package schemas

import (
	"time"

	"gorm.io/gorm"
)

type Professor struct {
	gorm.Model
	Nome   string
	Email  string
	CPF    string
	Turmas []Turma `gorm:"foreignKey:ProfessorID"`
}

type ProfessorResponse struct {
	ID        uint       `json:"id"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `json:"deletedAt,omitempty"`
	Nome      string     `json:"nome"`
	Email     string     `json:"email"`
	CPF       string     `json:"cpf"`
}
