package handler

import (
	"net/http"

	"github.com/AlejandroGleles/academichub/schemas"
	"github.com/gin-gonic/gin"
)

func DashboardHandler(ctx *gin.Context) {
	var totalProfessores int64
	var totalTurmas int64
	var totalAlunos int64
	var totalAtividades int64

	// Contagem de professores
	if err := db.Model(&schemas.Professor{}).Count(&totalProfessores).Error; err != nil {
		sendError(ctx, http.StatusInternalServerError, "Erro ao contar professores")
		return
	}

	// Contagem de turmas
	if err := db.Model(&schemas.Turma{}).Count(&totalTurmas).Error; err != nil {
		sendError(ctx, http.StatusInternalServerError, "Erro ao contar turmas")
		return
	}

	// Contagem de alunos
	if err := db.Model(&schemas.Aluno{}).Count(&totalAlunos).Error; err != nil {
		sendError(ctx, http.StatusInternalServerError, "Erro ao contar alunos")
		return
	}

	// Contagem de atividades
	if err := db.Model(&schemas.Atividade{}).Count(&totalAtividades).Error; err != nil {
		sendError(ctx, http.StatusInternalServerError, "Erro ao contar atividades")
		return
	}

	// Retorna os totais como JSON
	ctx.JSON(http.StatusOK, gin.H{
		"totalProfessores": totalProfessores,
		"totalTurmas":      totalTurmas,
		"totalAlunos":      totalAlunos,
		"totalAtividades":  totalAtividades,
	})
}
