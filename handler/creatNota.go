package handler

import (
	"fmt"
	"net/http"

	"github.com/AlejandroGleles/academichub/config"
	"github.com/AlejandroGleles/academichub/schemas"
	"github.com/gin-gonic/gin"
)

type CreateNotaRequest struct {
	AlunoID     uint `json:"aluno_id" binding:"required"`
	AtividadeID uint `json:"atividade_id" binding:"required"`
	Nota        int  `json:"nota" binding:"required"`
}

func CreateNotaHandler(ctx *gin.Context) {
	db := config.GetSqlite()

	var request CreateNotaRequest
	if err := ctx.BindJSON(&request); err != nil {
		sendError(ctx, http.StatusBadRequest, "Erro ao parsear dados da nota")
		return
	}

	// Valida a atividade
	var atividade schemas.Atividade
	if err := db.First(&atividade, request.AtividadeID).Error; err != nil {
		sendError(ctx, http.StatusNotFound, "Atividade não encontrada")
		return
	}

	// Valida a nota com base no valor máximo da atividade
	if request.Nota < 0 || request.Nota > atividade.Valor {
		sendError(ctx, http.StatusBadRequest, "A nota deve estar entre 0 e "+fmt.Sprint(atividade.Valor))
		return
	}

	// Verifica se a nota já existe
	var existingNota schemas.Nota
	if err := db.Where("aluno_id = ? AND atividade_id = ?", request.AlunoID, request.AtividadeID).First(&existingNota).Error; err == nil {
		sendError(ctx, http.StatusConflict, "Nota já existe para este aluno e atividade")
		return
	}

	// Cria a nova nota
	nota := schemas.Nota{
		AlunoID:     request.AlunoID,
		AtividadeID: request.AtividadeID,
		Valor:       request.Nota,
	}

	if err := db.Create(&nota).Error; err != nil {
		sendError(ctx, http.StatusInternalServerError, "Erro ao criar nota no banco de dados")
		return
	}

	sendSuccess(ctx, "Nota criada com sucesso", nota)
}
