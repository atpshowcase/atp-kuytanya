package handlers

import (
	"net/http"

	"github.com/atp-chatbot/backend/db"
	"github.com/atp-chatbot/backend/models"
	"github.com/gin-gonic/gin"
)

// ListReplies handles GET /api/replies
func ListReplies(c *gin.Context) {
	var rules []models.AutoReply
	if err := db.DB.Order("created_at desc").Find(&rules).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": rules})
}

// CreateReply handles POST /api/replies
func CreateReply(c *gin.Context) {
	var input struct {
		Keyword string `json:"keyword" binding:"required"`
		Reply   string `json:"reply" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	rule := models.AutoReply{
		Keyword:  input.Keyword,
		Reply:    input.Reply,
		IsActive: true,
	}

	if err := db.DB.Create(&rule).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": rule})
}

// UpdateReply handles PUT /api/replies/:id
func UpdateReply(c *gin.Context) {
	id := c.Param("id")

	var rule models.AutoReply
	if err := db.DB.First(&rule, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "rule not found"})
		return
	}

	var input struct {
		Keyword  *string `json:"keyword"`
		Reply    *string `json:"reply"`
		IsActive *bool   `json:"is_active"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updates := map[string]interface{}{}
	if input.Keyword != nil {
		updates["keyword"] = *input.Keyword
	}
	if input.Reply != nil {
		updates["reply"] = *input.Reply
	}
	if input.IsActive != nil {
		updates["is_active"] = *input.IsActive
	}

	if err := db.DB.Model(&rule).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": rule})
}

// DeleteReply handles DELETE /api/replies/:id
func DeleteReply(c *gin.Context) {
	id := c.Param("id")

	if err := db.DB.Delete(&models.AutoReply{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "rule deleted"})
}
