package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// AnalyticsHandler handles analytics-related HTTP requests
type AnalyticsHandler struct {
	// Dependencies will go here later (usecase, etc.)
}

// NewAnalyticsHandler creates a new handler instance
func NewAnalyticsHandler() *AnalyticsHandler {
	return &AnalyticsHandler{}
}

// GetStats handles GET /api/events/stats
func (h *AnalyticsHandler) GetStats(c *gin.Context) {
	// Create response
	response := gin.H{
		"success": true,
		"message": "Stats endpoint working!",
		"data": gin.H{
			"totalEvents": 0,
			"loginCount":  0,
		},
	}

	// Send JSON response (Gin auto-sets Content-Type)
	c.JSON(http.StatusOK, response)
}
