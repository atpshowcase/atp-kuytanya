package services

import (
	"time"

	"github.com/atp-chatbot/backend/config"
	"github.com/golang-jwt/jwt/v5"
)

const authCookieName = "jwt"

func AuthCookieName() string {
	return authCookieName
}

func CreateAuthToken(userID uint) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(7 * 24 * time.Hour).Unix(),
	})

	return token.SignedString([]byte(config.Cfg.JWTSecret))
}

func JWTSecret() []byte {
	return []byte(config.Cfg.JWTSecret)
}
