package handler

import (
	"net/http"

	"github.com/AlejandroGleles/academichub/schemas"
	"github.com/gin-gonic/gin"
)

func CreateProfessorHandler(ctx *gin.Context) {
	request := CreateOpenigRequest{}

	ctx.BindJSON(&request)

	if err := request.Validate(); err != nil {
		logger.Errorf("validation error: %v", err.Error())
		sendError(ctx, http.StatusBadRequest, err.Error())
		return
	}

	professor := schemas.Professor{
		Nome:  request.Nome,
		Email: request.Email,
		CPF:   request.CPF,
	}

	if err := db.Create(&professor).Error; err != nil {
		logger.Errorf("error creating openig: %v", err.Error())
		sendError(ctx, http.StatusInternalServerError, "error creating professor on database")
		return
	}
	sendSuccess(ctx, "create-proffesor", professor)

}
