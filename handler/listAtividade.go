package handler

import (
	"net/http"

	"github.com/AlejandroGleles/academichub/config"
	"github.com/AlejandroGleles/academichub/schemas"
	"github.com/gin-gonic/gin"
)

func ListAtividadeHandler(ctx *gin.Context) {
	var atividades []schemas.Atividade
	db := config.GetSqlite() // Obtém a instância existente do banco de dados

	if err := db.Find(&atividades).Error; err != nil {
		sendError(ctx, http.StatusInternalServerError, "Erro ao listar atividades")
		return
	}
	sendSuccess(ctx, "Lista de atividades", atividades)
}
