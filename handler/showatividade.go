package handler

import (
	"net/http"

	"github.com/AlejandroGleles/academichub/config"
	"github.com/AlejandroGleles/academichub/schemas"
	"github.com/gin-gonic/gin"
)

func ShowAtividadeHandler(ctx *gin.Context) {
	id := ctx.Query("id")
	if id == "" {
		sendError(ctx, http.StatusBadRequest, "Parâmetro de ID é obrigatório")
		return
	}

	var atividade schemas.Atividade
	db := config.GetSqlite() // Obtém a instância existente do banco de dados
	if err := db.First(&atividade, id).Error; err != nil {
		sendError(ctx, http.StatusNotFound, "Atividade não encontrada")
		return
	}

	sendSuccess(ctx, "Atividade encontrada", atividade)
}
