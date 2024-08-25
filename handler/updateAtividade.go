package handler

import (
	"net/http"

	"github.com/AlejandroGleles/academichub/schemas"
	"github.com/gin-gonic/gin"
)

func UpdateAtividadeHandler(ctx *gin.Context) {
	var request schemas.Atividade
	if err := ctx.BindJSON(&request); err != nil {
		sendError(ctx, http.StatusBadRequest, "Invalid request payload")
		return
	}

	id := ctx.Query("id")
	if id == "" {
		sendError(ctx, http.StatusBadRequest, "ID query parameter is required")
		return
	}

	var atividade schemas.Atividade
	if err := db.First(&atividade, id).Error; err != nil {
		sendError(ctx, http.StatusNotFound, "Atividade not found")
		return
	}

	// Validate if the total value does not exceed 100 points
	var totalValor int
	db.Model(&schemas.Atividade{}).Where("turma_id = ? AND id != ?", atividade.TurmaID, id).Select("sum(valor)").Row().Scan(&totalValor)
	if totalValor+request.Valor > 100 {
		sendError(ctx, http.StatusBadRequest, "Total value for activities exceeds 100 points")
		return
	}

	atividade.Valor = request.Valor
	atividade.Data = request.Data

	if err := db.Save(&atividade).Error; err != nil {
		sendError(ctx, http.StatusInternalServerError, "Error updating atividade")
		return
	}

	sendSuccess(ctx, "Atividade updated successfully", atividade)
}
