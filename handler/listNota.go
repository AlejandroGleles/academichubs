package handler

import (
	"net/http"

	"github.com/AlejandroGleles/academichub/config"
	"github.com/AlejandroGleles/academichub/schemas"
	"github.com/gin-gonic/gin"
)

func ListNotaHandler(ctx *gin.Context) {
	db := config.GetSqlite()

	var notas []schemas.Nota
	if err := db.Find(&notas).Error; err != nil {
		sendError(ctx, http.StatusInternalServerError, "Erro ao listar notas")
		return
	}

	sendSuccess(ctx, "Lista de notas", notas)
}
