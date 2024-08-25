package router

import (
	"github.com/gin-gonic/gin"
)

func Initialize() {
	router := gin.Default()

	// Configura o CORS
	PermissionCors(router)

	// Inicializa as rotas
	initializeRoutes(router)

	// Inicia o servidor
	router.Run(":8080")
}
