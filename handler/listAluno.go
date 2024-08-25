package handler

import (
	"net/http"

	"github.com/AlejandroGleles/academichub/config" // Certifique-se de importar o pacote config
	"github.com/gin-gonic/gin"
)

func ListAlunoHandler(ctx *gin.Context) {
	var alunos []struct {
		ID         uint   `json:"id"`
		Nome       string `json:"nome"`
		Matricula  int    `json:"matricula"`
		TurmaNames string `json:"turmaNames"`
	}

	db := config.GetSqlite() // Obtém a instância existente do banco de dados

	query := `
	SELECT a.id, a.nome, a.matricula, GROUP_CONCAT(t.nome, ', ') as turma_names
	FROM alunos a
	LEFT JOIN turma_aluno ta ON a.id = ta.aluno_id
	LEFT JOIN turmas t ON ta.turma_id = t.id
	WHERE a.deleted_at IS NULL
	GROUP BY a.id
`

	if err := db.Raw(query).Scan(&alunos).Error; err != nil {
		sendError(ctx, http.StatusInternalServerError, "Erro ao listar alunos")
		return
	}
	sendSuccess(ctx, "Lista de alunos", alunos)
}
