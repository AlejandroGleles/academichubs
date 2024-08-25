package handler

import (
	"net/http"

	"github.com/AlejandroGleles/academichub/config"
	"github.com/AlejandroGleles/academichub/schemas"
	"github.com/gin-gonic/gin"
)

func ShowProfessorHandler(ctx *gin.Context) {
	id := ctx.Query("id")
	if id == "" {
		sendError(ctx, http.StatusBadRequest, "Parâmetro de ID é obrigatório")
		return
	}

	var professor schemas.Professor
	db := config.GetSqlite() // Obtém a instância existente do banco de dados
	if err := db.First(&professor, id).Error; err != nil {
		sendError(ctx, http.StatusNotFound, "Professor não encontrado")
		return
	}

	sendSuccess(ctx, "Professor encontrado", professor)
}
