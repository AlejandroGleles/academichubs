package handler

import (
	"net/http"

	"github.com/AlejandroGleles/academichub/schemas"
	"github.com/gin-gonic/gin"
)

func DeleteAlunoHandler(ctx *gin.Context) {
	id := ctx.Query("id")
	if id == "" {
		sendError(ctx, http.StatusBadRequest, "ID query parameter is required")
		return
	}

	var aluno schemas.Aluno
	if err := db.Where("id = ?", id).First(&aluno).Error; err != nil {
		sendError(ctx, http.StatusNotFound, "Aluno not found")
		return
	}

	if err := db.Delete(&aluno).Error; err != nil {
		sendError(ctx, http.StatusInternalServerError, "Error deleting aluno")
		return
	}

	sendSuccess(ctx, "Aluno deleted successfully", nil)
}
