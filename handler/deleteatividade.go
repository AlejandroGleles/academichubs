package handler

import (
	"net/http"

	"github.com/AlejandroGleles/academichub/schemas"
	"github.com/gin-gonic/gin"
)

func DeleteAtividadeHandler(ctx *gin.Context) {
	id := ctx.Query("id")
	if id == "" {
		sendError(ctx, http.StatusBadRequest, "ID query parameter is required")
		return
	}

	var atividade schemas.Atividade
	if err := db.Delete(&atividade, id).Error; err != nil {
		sendError(ctx, http.StatusInternalServerError, "Error deleting atividade")
		return
	}

	sendSuccess(ctx, "Atividade deleted successfully", nil)
}
