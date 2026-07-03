package handlers

import (
	"net/http"

	"github.com/atp-chatbot/backend/db"
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
	phone := ""
	if whatsapp.Client != nil && whatsapp.Client.Store != nil && whatsapp.Client.Store.ID != nil {
		phone = "+" + whatsapp.Client.Store.ID.User
	}
	c.JSON(http.StatusOK, gin.H{
		"connected": whatsapp.IsConnected(),
		"logged_in": whatsapp.IsLoggedIn(),
		"phone":     phone,
	})
}

// Logout handles POST /api/logout
func Logout(c *gin.Context) {
	// Clear old messages from a previous session unconditionally
	db.DB.Exec("DELETE FROM messages")

	if err := whatsapp.LogoutAndReset(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to logout and reset: " + err.Error()})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{"message": "logged out and reset"})
}

