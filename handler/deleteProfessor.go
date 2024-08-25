package handler

import (
	"fmt"
	"net/http"

	"github.com/AlejandroGleles/academichub/schemas"
	"github.com/gin-gonic/gin"
)

func DeleteProfessorHandler(ctx *gin.Context) {

	id := ctx.Query("id")
	if id == "" {
		sendError(ctx, http.StatusBadRequest, errParamIsRequired("id", "queryParameter").Error())
		return
	}
	professor := schemas.Professor{}
	//find Professor
	if err := db.First(&professor, id).Error; err != nil {
		sendError(ctx, http.StatusNotFound, fmt.Sprintf("professor com id: %s nao encontrado", id))
		return
	}
	//Delete professor
	if err := db.Delete(&professor).Error; err != nil {
		sendError(ctx, http.StatusInternalServerError, fmt.Sprintf("erro ao deletar professor com id: %s", id))
		return
	}
	sendSuccess(ctx, "professor deletado", professor)
}
