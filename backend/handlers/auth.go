package handlers

import (
	"net/http"

	"github.com/atp-chatbot/backend/config"
	"github.com/atp-chatbot/backend/models"
	"github.com/atp-chatbot/backend/repositories"
	"github.com/atp-chatbot/backend/services"
	"github.com/gin-gonic/gin"
)

type AuthRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// Register handles POST /api/register
func Register(c *gin.Context) {
	var req AuthRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if user exists
	if _, err := repositories.FindUserByUsername(req.Username); err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Username already taken"})
		return
	}

	user := models.User{Username: req.Username}
	if err := user.SetPassword(req.Password); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	if err := repositories.CreateUser(&user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
}

// Login handles POST /api/login
func Login(c *gin.Context) {
	var req AuthRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := repositories.FindUserByUsername(req.Username)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	if !user.CheckPassword(req.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}

	tokenString, err := services.CreateAuthToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(services.AuthCookieName(), tokenString, 3600*24*7, "/", "", config.Cfg.CookieSecure, true)

	c.JSON(http.StatusOK, gin.H{"message": "Logged in successfully", "user": gin.H{"id": user.ID, "username": user.Username}})
}

// AuthLogout handles POST /api/auth/logout
func AuthLogout(c *gin.Context) {
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(services.AuthCookieName(), "", -1, "/", "", config.Cfg.CookieSecure, true)
	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}

// CheckAuth handles GET /api/auth/me
func CheckAuth(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authenticated"})
		return
	}

	user, err := repositories.FindUserByID(userID)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"user": gin.H{"id": user.ID, "username": user.Username}})
}
