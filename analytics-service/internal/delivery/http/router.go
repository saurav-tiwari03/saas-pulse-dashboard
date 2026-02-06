package http

import (
	"github.com/gin-gonic/gin"
	"github.com/saurav-tiwari03/saas-pulse-dashboard/internal/delivery/http/handlers"
	"github.com/saurav-tiwari03/saas-pulse-dashboard/internal/infrastructure/kafka"
)

// SetupRouter creates and configures the Gin router
func SetupRouter(producer *kafka.Producer) *gin.Engine {
	// Create a new Gin router with default middleware (logger, recovery)
	router := gin.Default()

	// Initialize handlers
	analyticsHandler := handlers.NewAnalyticsHandler(producer)

	// API routes group
	api := router.Group("/api")
	{
		// Events routes
		events := api.Group("/events")
		{
			events.GET("/stats", analyticsHandler.GetStats)
			events.POST("/event", analyticsHandler.AddEvent)
		}
	}

	return router
}
