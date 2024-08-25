package schemas

import (
	"time"

	"gorm.io/gorm"
)

type Atividade struct {
	gorm.Model
	TurmaID uint
	Turma   Turma `gorm:"foreignKey:TurmaID"`
	Valor   int
	Data    time.Time // Alterado para time.Time
}

type AtividadeResponse struct {
	ID        uint       `json:"id"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `json:"deletedAt,omitempty"`
	Turma     string     `json:"turma"`
	Valor     int        `json:"valor"`
	Data      string     `json:"data"`
}
