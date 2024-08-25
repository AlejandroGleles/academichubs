package router

import (
	"github.com/AlejandroGleles/academichub/handler"
	"github.com/gin-gonic/gin"
)

func initializeRoutes(router *gin.Engine) {
	// Initialize handler
	handler.InitializeHandler()
	v1 := router.Group("/api/v1")
	{
		// Routes professor
		v1.GET("/dashboard", handler.DashboardHandler)

		v1.GET("/professor", handler.ShowProfessorHandler)
		v1.POST("/professor", handler.CreateProfessorHandler)
		v1.DELETE("/professor", handler.DeleteProfessorHandler)
		v1.PUT("/professor", handler.UpdateProfessorHandler)
		v1.GET("/professores", handler.ListProfessorHandler)
	}

	{
		// Routes aluno
		v1.GET("/aluno", handler.ShowAlunoHandler)
		v1.POST("/aluno", handler.CreateAlunoHandler)
		v1.DELETE("/aluno", handler.DeleteAlunoHandler)
		v1.PUT("/aluno", handler.UpdateAlunoHandler)
		v1.GET("/alunos", handler.ListAlunoHandler)
	}

	{
		// Routes turma
		v1.GET("/turma", handler.ShowTurmaHandler)
		v1.POST("/turma", handler.CreateTurmaHandler)
		v1.DELETE("/turma", handler.DeleteTurmaHandler)
		v1.PUT("/turma", handler.UpdateTurmaHandler)
		v1.GET("/turmas", handler.ListTurmaHandler)
	}

	{
		// Routes atividade
		v1.GET("/atividade", handler.ShowAtividadeHandler)
		v1.POST("/atividade", handler.CreateAtividadeHandler)
		v1.DELETE("/atividade", handler.DeleteAtividadeHandler)
		v1.PUT("/atividade", handler.UpdateAtividadeHandler)
		v1.GET("/atividades", handler.ListAtividadeHandler)
	}

	{
		// Routes nota
		v1.GET("/nota", handler.ShowNotaHandler)
		v1.POST("/nota", handler.CreateNotaHandler)
		v1.DELETE("/nota", handler.DeleteNotaHandler)
		v1.PUT("/nota", handler.UpdateNotaHandler)
		v1.GET("/notas", handler.ListNotaHandler)
	}

}
