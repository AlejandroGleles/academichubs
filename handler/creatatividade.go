package handler

import (
	"fmt"
	"net/http"
	"time"

	"github.com/AlejandroGleles/academichub/config"
	"github.com/AlejandroGleles/academichub/schemas"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func CreateAtividadeHandler(ctx *gin.Context) {
	var request CreateAtividadeRequest
	if err := ctx.BindJSON(&request); err != nil {
		sendError(ctx, http.StatusBadRequest, "Invalid request payload: "+err.Error())
		return
	}

	// Validate the request
	if err := request.Validate(); err != nil {
		sendError(ctx, http.StatusBadRequest, err.Error())
		return
	}

	// Convert date
	data, err := time.Parse("02/01/2006", request.Data)
	if err != nil {
		sendError(ctx, http.StatusBadRequest, "Invalid date format: "+err.Error())
		return
	}

	// Check if the total value for activities in the turma exceeds 100 points
	var totalValor int
	db := config.GetSqlite()
	err = db.Model(&schemas.Atividade{}).Where("turma_id = ?", request.TurmaID).Select("COALESCE(SUM(valor), 0)").Row().Scan(&totalValor)
	if err != nil {
		sendError(ctx, http.StatusInternalServerError, "Error calculating total value: "+err.Error())
		return
	}

	if totalValor+request.Valor > 100 {
		sendError(ctx, http.StatusBadRequest, "Total de atividades de atividades ja cadastradas ultrapaca 100 pontos")
		return
	}

	// Create the activity record
	atividade := schemas.Atividade{
		TurmaID: request.TurmaID,
		Valor:   request.Valor,
		Data:    data,
	}

	if err := db.Create(&atividade).Error; err != nil {
		sendError(ctx, http.StatusInternalServerError, "Error creating atividade: "+err.Error())
		return
	}

	// Format date for response
	atividadeResponse := schemas.AtividadeResponse{
		ID:        atividade.ID,
		CreatedAt: atividade.CreatedAt,
		UpdatedAt: atividade.UpdatedAt,
		DeletedAt: formatDeletedAt(atividade.DeletedAt),
		Turma:     fmt.Sprintf("%d", atividade.TurmaID),
		Valor:     atividade.Valor,
		Data:      atividade.Data.Format("02/01/2006"),
	}

	sendSuccess(ctx, "Atividade created successfully", atividadeResponse)
}

// Helper function to format DeletedAt
func formatDeletedAt(deletedAt gorm.DeletedAt) *time.Time {
	if deletedAt.Time.IsZero() {
		return nil
	}
	return &deletedAt.Time
}
