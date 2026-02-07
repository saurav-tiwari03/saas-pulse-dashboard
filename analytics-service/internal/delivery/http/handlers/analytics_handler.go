package handlers

import (
	"net/http"

	gin "github.com/gin-gonic/gin"
	kafka "github.com/saurav-tiwari03/saas-pulse-dashboard/internal/infrastructure/kafka"
	responseHandler "github.com/saurav-tiwari03/saas-pulse-dashboard/internal/utils"
)

// AnalyticsHandler handles analytics-related HTTP requests
type AnalyticsHandler struct {
	// Dependencies will go here later (usecase, etc.)
	producer *kafka.Producer
}

type AddEventRequest struct {
	EventType string                 `json:"eventType" binding:"required"`
	UserID    string                 `json:"userId" binding:"required"`
	Data      map[string]interface{} `json:"data"` // optional flexible data
}

// NewAnalyticsHandler creates a new handler instance
func NewAnalyticsHandler(producer *kafka.Producer) *AnalyticsHandler {
	return &AnalyticsHandler{
		producer: producer,
	}
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
	responseHandler.SendSuccess(c, response)
}

func (h *AnalyticsHandler) AddEvent(c *gin.Context) {
	var body AddEventRequest

	if err := c.ShouldBindJSON(&body); err != nil {
		responseHandler.SendError(c, http.StatusBadRequest, err.Error())
		return
	}
	err := h.producer.SendEvent(c.Request.Context(), body)
	if err != nil {
		responseHandler.SendError(c, http.StatusInternalServerError, err.Error())
		return
	}
	responseHandler.SendSuccess(c, gin.H{
		"success": true,
		"message": "Event added successfully",
		"data":    body,
	})
}
