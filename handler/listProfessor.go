package handler

import (
	"net/http"

	"github.com/AlejandroGleles/academichub/config"
	"github.com/AlejandroGleles/academichub/schemas"
	"github.com/gin-gonic/gin"
)

func ListProfessorHandler(ctx *gin.Context) {
	var professores []schemas.Professor
	db := config.GetSqlite() // Obtém a instância existente do banco de dados

	if err := db.Find(&professores).Error; err != nil {
		sendError(ctx, http.StatusInternalServerError, "Erro ao listar professores")
		return
	}
	sendSuccess(ctx, "Lista de professores", professores)
}
