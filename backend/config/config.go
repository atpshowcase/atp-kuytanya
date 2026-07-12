package config

import (
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	AppEnv             string
	Port               string
	DatabaseURL        string
	WaDBURL            string
	JWTSecret          string
	FrontendURL        string
	CORSAllowedOrigins []string
	CookieSecure       bool
}

var Cfg *Config

func Load() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, reading from environment")
	}

	appEnv := getEnv("APP_ENV", "development")
	if err := godotenv.Load(".env." + appEnv); err == nil {
		log.Printf("Loaded environment overrides from .env.%s", appEnv)
	}

	frontendURL := getEnv("FRONTEND_URL", "http://localhost:3000")

	Cfg = &Config{
		AppEnv:             appEnv,
		Port:               getEnv("PORT", "8080"),
		DatabaseURL:        getEnv("DATABASE_URL", ""),
		WaDBURL:            getEnv("WA_DB_URL", ""),
		JWTSecret:          getEnv("JWT_SECRET", ""),
		FrontendURL:        frontendURL,
		CORSAllowedOrigins: splitCSV(getEnv("CORS_ALLOWED_ORIGINS", frontendURL)),
		CookieSecure:       getBoolEnv("COOKIE_SECURE", appEnv == "production"),
	}

	require("DATABASE_URL", Cfg.DatabaseURL)
	require("WA_DB_URL", Cfg.WaDBURL)
	require("JWT_SECRET", Cfg.JWTSecret)
}

func require(key, value string) {
	if strings.TrimSpace(value) == "" {
		log.Fatalf("%s is required", key)
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func getBoolEnv(key string, fallback bool) bool {
	value, ok := os.LookupEnv(key)
	if !ok {
		return fallback
	}

	parsed, err := strconv.ParseBool(value)
	if err != nil {
		log.Fatalf("%s must be a boolean value", key)
	}
	return parsed
}

func splitCSV(value string) []string {
	parts := strings.Split(value, ",")
	result := make([]string, 0, len(parts))
	for _, part := range parts {
		trimmed := strings.TrimSpace(part)
		if trimmed != "" {
			result = append(result, trimmed)
		}
	}
	return result
}
