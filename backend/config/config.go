package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port        string
	DatabaseURL string // GORM DSN for app data (PostgreSQL)
	WaDBURL     string // postgres URL for whatsmeow session storage
}

var Cfg *Config

func Load() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, reading from environment")
	}

	Cfg = &Config{
		Port:        getEnv("PORT", "8080"),
		DatabaseURL: getEnv("DATABASE_URL", "host=localhost user=postgres password= dbname=atp_chatbot port=5432 sslmode=disable"),
		WaDBURL:     getEnv("WA_DB_URL", "postgres://postgres@localhost:5432/atp_chatbot?sslmode=disable"),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
