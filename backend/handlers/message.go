package handlers

import (
	"net/http"

	"github.com/atp-chatbot/backend/db"
	"github.com/atp-chatbot/backend/models"
	"github.com/gin-gonic/gin"
)

// ListMessages handles GET /api/messages
func ListMessages(c *gin.Context) {
	var messages []models.Message
	if err := db.DB.Order("received_at desc").Limit(100).Find(&messages).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": messages})
}
