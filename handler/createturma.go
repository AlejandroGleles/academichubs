package handler

import (
	"net/http"

	"github.com/AlejandroGleles/academichub/config"
	"github.com/AlejandroGleles/academichub/schemas"
	"github.com/gin-gonic/gin"
)

func CreateTurmaHandler(ctx *gin.Context) {
	var request CreateTurmaRequest
	if err := ctx.BindJSON(&request); err != nil {
		sendError(ctx, http.StatusBadRequest, "Invalid request payload")
		return
	}

	turma := schemas.Turma{
		Nome:        request.Nome,
		Semestre:    request.Semestre,
		Ano:         request.Ano,
		ProfessorID: request.ProfessorID,
	}

	db := config.GetSqlite()
	if err := db.Create(&turma).Error; err != nil {
		sendError(ctx, http.StatusInternalServerError, "Error creating turma")
		return
	}

	// Fetch the professor's name
	var professor schemas.Professor
	if err := db.First(&professor, turma.ProfessorID).Error; err != nil {
		sendError(ctx, http.StatusInternalServerError, "Error fetching professor")
		return
	}

	response := struct {
		ID        uint   `json:"id"`
		Nome      string `json:"nome"`
		Semestre  string `json:"semestre"`
		Ano       string `json:"ano"`
		Professor string `json:"professor"`
	}{
		ID:        turma.ID,
		Nome:      turma.Nome,
		Semestre:  turma.Semestre,
		Ano:       turma.Ano,
		Professor: professor.Nome,
	}

	sendSuccess(ctx, "Turma created successfully", response)
}
