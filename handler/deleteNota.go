package handler

import (
	"net/http"

	"github.com/AlejandroGleles/academichub/config"
	"github.com/AlejandroGleles/academichub/schemas"
	"github.com/gin-gonic/gin"
)

func DeleteNotaHandler(ctx *gin.Context) {
	db := config.GetSqlite()

	id := ctx.Query("id")
	if id == "" {
		sendError(ctx, http.StatusBadRequest, "Parâmetro de ID é obrigatório")
		return
	}

	if err := db.Delete(&schemas.Nota{}, id).Error; err != nil {
		sendError(ctx, http.StatusInternalServerError, "Erro ao deletar nota")
		return
	}

	sendSuccess(ctx, "Nota deletada com sucesso", nil)
}
