package handler

import (
	"net/http"

	"github.com/AlejandroGleles/academichub/schemas"
	"github.com/gin-gonic/gin"
)

func DeleteTurmaHandler(ctx *gin.Context) {
	id := ctx.Query("id")
	if id == "" {
		sendError(ctx, http.StatusBadRequest, "ID query parameter is required")
		return
	}

	var turma schemas.Turma
	if err := db.Delete(&turma, id).Error; err != nil {
		sendError(ctx, http.StatusInternalServerError, "Error deleting turma")
		return
	}

	sendSuccess(ctx, "Turma deleted successfully", nil)
}
