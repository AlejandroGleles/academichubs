package handler

import (
	"net/http"

	"github.com/AlejandroGleles/academichub/config"
	"github.com/AlejandroGleles/academichub/schemas"
	"github.com/gin-gonic/gin"
)

func ShowTurmaHandler(ctx *gin.Context) {
	id := ctx.Query("id")
	if id == "" {
		sendError(ctx, http.StatusBadRequest, "Parâmetro de ID é obrigatório")
		return
	}

	var turma schemas.Turma
	db := config.GetSqlite() // Obtém a instância existente do banco de dados
	if err := db.First(&turma, id).Error; err != nil {
		sendError(ctx, http.StatusNotFound, "Turma não encontrada")
		return
	}

	sendSuccess(ctx, "Turma encontrada", turma)
}
