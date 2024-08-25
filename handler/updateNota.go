package handler

import (
	"net/http"

	"github.com/AlejandroGleles/academichub/config"
	"github.com/AlejandroGleles/academichub/schemas"
	"github.com/gin-gonic/gin"
)

type UpdateNotaRequest struct {
	Nota int `json:"nota" binding:"required,min=0,max=100"`
}

func UpdateNotaHandler(ctx *gin.Context) {
	db := config.GetSqlite()

	var request UpdateNotaRequest
	if err := ctx.BindJSON(&request); err != nil {
		sendError(ctx, http.StatusBadRequest, "Erro ao parsear dados da nota")
		return
	}

	id := ctx.Query("id")
	if id == "" {
		sendError(ctx, http.StatusBadRequest, "Parâmetro de ID é obrigatório")
		return
	}

	nota := schemas.Nota{}
	if err := db.First(&nota, id).Error; err != nil {
		sendError(ctx, http.StatusNotFound, "Nota não encontrada")
		return
	}

	// Atualiza a nota
	if request.Nota < 0 || request.Nota > 100 {
		sendError(ctx, http.StatusBadRequest, "A nota deve estar entre 0 e 100")
		return
	}
	nota.Valor = request.Nota

	if err := db.Save(&nota).Error; err != nil {
		sendError(ctx, http.StatusInternalServerError, "Erro ao atualizar nota")
		return
	}

	sendSuccess(ctx, "Nota atualizada com sucesso", nota)
}
