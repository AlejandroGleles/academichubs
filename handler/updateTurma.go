package handler

import (
	"net/http"

	"github.com/AlejandroGleles/academichub/schemas"
	"github.com/gin-gonic/gin"
)

func UpdateTurmaHandler(ctx *gin.Context) {
	var request schemas.Turma
	if err := ctx.BindJSON(&request); err != nil {
		sendError(ctx, http.StatusBadRequest, "Invalid request payload")
		return
	}

	id := ctx.Query("id")
	if id == "" {
		sendError(ctx, http.StatusBadRequest, "ID query parameter is required")
		return
	}

	var turma schemas.Turma
	if err := db.First(&turma, id).Error; err != nil {
		sendError(ctx, http.StatusNotFound, "Turma not found")
		return
	}

	if request.Nome != "" {
		turma.Nome = request.Nome
	}
	if request.Semestre != "" {
		turma.Semestre = request.Semestre
	}
	if request.Ano != "" {
		turma.Ano = request.Ano
	}
	if request.ProfessorID > 0 {
		turma.ProfessorID = request.ProfessorID
	}

	if err := db.Save(&turma).Error; err != nil {
		sendError(ctx, http.StatusInternalServerError, "Error updating turma")
		return
	}

	sendSuccess(ctx, "Turma updated successfully", turma)
}
