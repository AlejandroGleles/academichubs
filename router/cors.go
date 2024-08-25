package router

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func PermissionCors(router *gin.Engine) {
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"}, // Permite todas as origens para teste
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type", "Authorization"},
	}))
}
