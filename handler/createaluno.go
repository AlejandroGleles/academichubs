package handler

import (
	"net/http"

	"github.com/AlejandroGleles/academichub/schemas"
	"github.com/gin-gonic/gin"
)

func CreateAlunoHandler(ctx *gin.Context) {
	var request CreateAlunoRequest

	// Faz o bind da requisição JSON para a estrutura CreateAlunoRequest
	if err := ctx.BindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// Valida os dados da solicitação
	if err := request.Validate(); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Cria um novo aluno
	aluno := schemas.Aluno{
		Nome:      request.Nome,
		Matricula: request.Matricula,
	}

	if err := db.Create(&aluno).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating aluno"})
		return
	}

	// Associa o aluno às turmas
	for _, turmaID := range request.Turmas {
		var turma schemas.Turma
		if err := db.First(&turma, turmaID).Error; err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Turma não encontrada"})
			return
		}
		db.Model(&aluno).Association("Turmas").Append(&turma)
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Aluno criado com sucesso", "aluno": aluno})
}
