package main

import (
	"github.com/AlejandroGleles/academichub/config"
	"github.com/AlejandroGleles/academichub/router"
)

var (
	logger config.Logger
)

func main() {
	// Initialize the logger
	logger = *config.GetLogger("main")

	// Initialize config
	err := config.Init()
	if err != nil {
		logger.Errorf("config initialization error: %v", err)
		return
	}

	// Initialize routes and run the server
	router.Initialize()
}
