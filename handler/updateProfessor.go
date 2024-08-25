package handler

import (
	"net/http"

	"github.com/AlejandroGleles/academichub/config"
	"github.com/AlejandroGleles/academichub/schemas"
	"github.com/gin-gonic/gin"
)

// UpdateProfessorHandler atualiza os detalhes de um professor existente
func UpdateProfessorHandler(ctx *gin.Context) {
	// Obtém a instância do banco de dados
	db := config.GetSqlite()

	// Define o tipo de solicitação esperada
	var request schemas.Professor
	if err := ctx.BindJSON(&request); err != nil {
		sendError(ctx, http.StatusBadRequest, "Erro ao parsear dados do professor")
		return
	}

	// Obtém o ID do professor a ser atualizado
	id := ctx.Query("id")
	if id == "" {
		sendError(ctx, http.StatusBadRequest, "Parâmetro de ID é obrigatório")
		return
	}

	// Encontra o professor existente
	professor := schemas.Professor{}
	if err := db.First(&professor, id).Error; err != nil {
		sendError(ctx, http.StatusNotFound, "Professor não encontrado")
		return
	}

	// Atualiza os campos do professor apenas se foram fornecidos
	if request.Nome != "" {
		professor.Nome = request.Nome
	}
	if request.Email != "" {
		professor.Email = request.Email
	}
	if request.CPF != "" {
		professor.CPF = request.CPF
	}

	// Salva as alterações no banco de dados
	if err := db.Save(&professor).Error; err != nil {
		sendError(ctx, http.StatusInternalServerError, "Erro ao atualizar professor")
		return
	}

	// Envia a resposta de sucesso
	sendSuccess(ctx, "Professor atualizado com sucesso", professor)
}
