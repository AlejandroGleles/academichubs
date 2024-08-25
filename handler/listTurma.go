package handler

import (
	"net/http"

	"github.com/AlejandroGleles/academichub/config"
	"github.com/AlejandroGleles/academichub/schemas"
	"github.com/gin-gonic/gin"
)

func ListTurmaHandler(ctx *gin.Context) {
	var turmas []schemas.Turma
	db := config.GetSqlite() // Obtém a instância existente do banco de dados

	if err := db.Find(&turmas).Error; err != nil {
		sendError(ctx, http.StatusInternalServerError, "Erro ao listar turmas")
		return
	}
	sendSuccess(ctx, "Lista de turmas", turmas)
}
