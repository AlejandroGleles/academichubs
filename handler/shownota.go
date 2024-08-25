package handler

import (
	"net/http"

	"github.com/AlejandroGleles/academichub/config"
	"github.com/AlejandroGleles/academichub/schemas"
	"github.com/gin-gonic/gin"
)

func ShowNotaHandler(ctx *gin.Context) {
	id := ctx.Query("id")
	if id == "" {
		sendError(ctx, http.StatusBadRequest, "Parâmetro de ID é obrigatório")
		return
	}

	var nota schemas.Nota
	db := config.GetSqlite() // Obtém a instância existente do banco de dados
	if err := db.First(&nota, id).Error; err != nil {
		sendError(ctx, http.StatusNotFound, "Nota não encontrada")
		return
	}

	sendSuccess(ctx, "Nota encontrada", nota)
}
