package middleware

import (
	"fmt"
	"net/http"

	"github.com/atp-chatbot/backend/services"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// RequireAuth is a middleware that checks for a valid JWT cookie
func RequireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString, err := c.Cookie(services.AuthCookieName())
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: No token provided"})
			return
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method")
			}
			return services.JWTSecret(), nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: Invalid token"})
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: Invalid claims"})
			return
		}

		userIDFloat, ok := claims["user_id"].(float64)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: Invalid user ID"})
			return
		}

		// Inject userID into the request context
		c.Set("userID", uint(userIDFloat))
		c.Next()
	}
}
