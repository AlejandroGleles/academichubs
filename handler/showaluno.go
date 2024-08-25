package handler

import (
	"net/http"

	"github.com/AlejandroGleles/academichub/config"
	"github.com/AlejandroGleles/academichub/schemas"
	"github.com/gin-gonic/gin"
)

func ShowAlunoHandler(ctx *gin.Context) {
	id := ctx.Query("id")
	if id == "" {
		sendError(ctx, http.StatusBadRequest, "Parâmetro de ID é obrigatório")
		return
	}

	var aluno schemas.Aluno
	db := config.GetSqlite() // Obtém a instância existente do banco de dados
	if err := db.First(&aluno, id).Error; err != nil {
		sendError(ctx, http.StatusNotFound, "Aluno não encontrado")
		return
	}

	sendSuccess(ctx, "Aluno encontrado", aluno)
}
