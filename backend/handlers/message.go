package handlers

import (
	"net/http"

	"github.com/atp-chatbot/backend/repositories"
	"github.com/gin-gonic/gin"
)

// ListMessages handles GET /api/messages
func ListMessages(c *gin.Context) {
	userID := c.MustGet("userID").(uint)

	messages, err := repositories.ListRecentMessages(userID, 100)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": messages})
}
