package handlers

import (
	"context"
	"net/http"

	"github.com/atp-chatbot/backend/whatsapp"
	"github.com/gin-gonic/gin"
)

// GetQR handles GET /api/qr
func GetQR(c *gin.Context) {
	qr := whatsapp.GetQR()
	connected := whatsapp.IsLoggedIn()

	c.JSON(http.StatusOK, gin.H{
		"qr":        qr,
		"connected": connected,
	})
}

// GetStatus handles GET /api/status
func GetStatus(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"connected": whatsapp.IsConnected(),
		"logged_in": whatsapp.IsLoggedIn(),
	})
}

// Logout handles POST /api/logout
func Logout(c *gin.Context) {
	if whatsapp.Client != nil {
		if err := whatsapp.Client.Logout(context.Background()); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}
	c.JSON(http.StatusOK, gin.H{"message": "logged out"})
}

