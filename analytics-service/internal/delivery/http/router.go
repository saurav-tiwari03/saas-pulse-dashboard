package http

import (
	"github.com/gin-gonic/gin"
	"github.com/saurav-tiwari03/saas-pulse-dashboard/internal/delivery/http/handlers"
)

// SetupRouter creates and configures the Gin router
func SetupRouter() *gin.Engine {
	// Create a new Gin router with default middleware (logger, recovery)
	router := gin.Default()

	// Initialize handlers
	analyticsHandler := handlers.NewAnalyticsHandler()

	// API routes group
	api := router.Group("/api")
	{
		// Events routes
		events := api.Group("/events")
		{
			events.GET("/stats", analyticsHandler.GetStats)
		}
	}

	return router
}
