package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/atp-chatbot/backend/config"
	"github.com/atp-chatbot/backend/db"
	"github.com/atp-chatbot/backend/handlers"
	wa "github.com/atp-chatbot/backend/whatsapp"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Load config
	config.Load()

	// Connect PostgreSQL (GORM)
	db.Connect()

	// Start WhatsApp client (generates QR or reconnects)
	if err := wa.Init(); err != nil {
		log.Fatalf("WhatsApp init error: %v", err)
	}

	// Graceful shutdown on Ctrl+C
	go func() {
		c := make(chan os.Signal, 1)
		signal.Notify(c, os.Interrupt, syscall.SIGTERM)
		<-c
		log.Println("Shutting down...")
		wa.Disconnect()
		os.Exit(0)
	}()

	// ── HTTP Router ─────────────────────────────────────────────────────────
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	api := r.Group("/api")
	{
		// WhatsApp connection
		api.GET("/qr", handlers.GetQR)
		api.GET("/status", handlers.GetStatus)
		api.POST("/logout", handlers.Logout)

		// Auto-reply rules
		api.GET("/replies", handlers.ListReplies)
		api.POST("/replies", handlers.CreateReply)
		api.PUT("/replies/:id", handlers.UpdateReply)
		api.DELETE("/replies/:id", handlers.DeleteReply)

		// Incoming messages log
		api.GET("/messages", handlers.ListMessages)
	}

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "wa_connected": wa.IsLoggedIn()})
	})

	log.Printf("🚀 Server running on port %s", config.Cfg.Port)
	log.Println("📱 Open http://localhost:3000/connect to scan WhatsApp QR")

	if err := r.Run(":" + config.Cfg.Port); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}
