package schemas

import (
	"time"

	"gorm.io/gorm"
)

type Nota struct {
	gorm.Model
	AlunoID     uint
	Aluno       Aluno `gorm:"foreignKey:AlunoID"`
	AtividadeID uint
	Atividade   Atividade `gorm:"foreignKey:AtividadeID"`
	Valor       int
}

type NotaResponse struct {
	ID        uint       `json:"id"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `json:"deletedAt,omitempty"`
	Aluno     Aluno      `json:"aluno"`
	Atividade Atividade  `json:"atividade"`
	Valor     int        `json:"valor"`
}
