package handlers

import (
	"net/http"

	"github.com/atp-chatbot/backend/whatsapp"
	"github.com/gin-gonic/gin"
)

// GetQR handles GET /api/qr
func GetQR(c *gin.Context) {
	userID := c.MustGet("userID").(uint)

	client := whatsapp.GetUserClient(userID)
	if client == nil || !client.IsConnected() {
		go whatsapp.GenerateNewQR(userID)
	}

	qr := whatsapp.GetQR(userID)
	connected := whatsapp.IsLoggedIn(userID)
	phone := ""
	if client != nil && client.Store != nil && client.Store.ID != nil {
		phone = "+" + client.Store.ID.User
	}

	c.JSON(http.StatusOK, gin.H{
		"qr":        qr,
		"connected": connected,
		"phone":     phone,
	})
}

// GetStatus handles GET /api/status
func GetStatus(c *gin.Context) {
	userID := c.MustGet("userID").(uint)
	phone := ""
	client := whatsapp.GetUserClient(userID)
	if client != nil && client.Store != nil && client.Store.ID != nil {
		phone = "+" + client.Store.ID.User
	}
	c.JSON(http.StatusOK, gin.H{
		"connected": whatsapp.IsConnected(userID),
		"logged_in": whatsapp.IsLoggedIn(userID),
		"phone":     phone,
	})
}

// Logout handles POST /api/logout
func Logout(c *gin.Context) {
	userID := c.MustGet("userID").(uint)
	if err := whatsapp.LogoutAndReset(userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to logout and reset: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "logged out and reset"})
}
