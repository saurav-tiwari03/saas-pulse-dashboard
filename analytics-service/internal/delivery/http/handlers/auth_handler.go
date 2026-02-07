package handlers

import (
	"net/http"

	gin "github.com/gin-gonic/gin"
	responseHandler "github.com/saurav-tiwari03/saas-pulse-dashboard/internal/utils"
	jwt "github.com/saurav-tiwari03/saas-pulse-dashboard/pfg/jwt"
	Log "github.com/saurav-tiwari03/saas-pulse-dashboard/pfg/logger"
)

var log = Log.New("info")

// LoginRequest defines the expected request body for login
type LoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func Login(c *gin.Context) {
	var body LoginRequest

	// Bind JSON body to struct
	if err := c.ShouldBindJSON(&body); err != nil {
		log.Error(err, "Failed to parse login request")
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid request body",
			"error":   err.Error(),
		})
		return
	}

	token, err := jwt.CreateToken(body.Email, []byte("secret"))
	if err != nil {
		log.Error(err, "Failed to create token")
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to create token",
			"error":   err.Error(),
		})
		return
	}

	responseHandler.SendSuccess(c, gin.H{
		"success": true,
		"message": "Login endpoint working!",
		"data": gin.H{
			"email": body.Email,
			"token": token,
		},
	})
}
