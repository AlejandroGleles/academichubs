package handler

import (
	"net/http"

	"github.com/AlejandroGleles/academichub/schemas"
	"github.com/gin-gonic/gin"
)

func UpdateAlunoHandler(ctx *gin.Context) {
	var request UpdateAlunoRequest

	// Faz o bind da requisição JSON para a estrutura UpdateAlunoRequest
	if err := ctx.BindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// Valida os dados da solicitação
	if err := request.Validate(); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	alunoID := ctx.Query("id")
	if alunoID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "ID é obrigatório"})
		return
	}

	var aluno schemas.Aluno
	if err := db.First(&aluno, alunoID).Error; err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Aluno não encontrado"})
		return
	}

	// Atualiza os dados do aluno
	if request.Nome != "" {
		aluno.Nome = request.Nome
	}
	if request.Matricula > 0 {
		aluno.Matricula = request.Matricula
	}
	if len(request.Turmas) > 0 {
		// Atualiza as turmas associadas
		var turmas []schemas.Turma
		db.Where("id IN ?", request.Turmas).Find(&turmas)
		db.Model(&aluno).Association("Turmas").Replace(turmas)
	}

	// Salva as alterações
	if err := db.Save(&aluno).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error updating aluno"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Aluno atualizado com sucesso", "aluno": aluno})
}
