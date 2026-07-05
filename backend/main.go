package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/atp-chatbot/backend/config"
	"github.com/atp-chatbot/backend/db"
	"github.com/atp-chatbot/backend/handlers"
	"github.com/atp-chatbot/backend/middleware"
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
		AllowOrigins: []string{
			"http://localhost:3000",
			"http://localhost:2027",
			"https://kuytanya.web.id",
			"https://www.kuytanya.web.id",
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	api := r.Group("/api")
	{
		// Auth Routes
		api.POST("/register", handlers.Register)
		api.POST("/login", handlers.Login)
		api.POST("/auth/logout", handlers.AuthLogout)
		
		// Protected Routes
		protected := api.Group("")
		protected.Use(middleware.RequireAuth())
		{
			protected.GET("/auth/me", handlers.CheckAuth)

			// WhatsApp connection
			protected.GET("/qr", handlers.GetQR)
			protected.GET("/status", handlers.GetStatus)
			protected.POST("/logout", handlers.Logout)

			// Auto-reply rules
			protected.GET("/replies", handlers.ListReplies)
			protected.POST("/replies", handlers.CreateReply)
			protected.PUT("/replies/:id", handlers.UpdateReply)
			protected.DELETE("/replies/:id", handlers.DeleteReply)

			// Incoming messages log
			protected.GET("/messages", handlers.ListMessages)
		}
	}

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	log.Printf("🚀 Server running on port %s", config.Cfg.Port)
	log.Println("📱 Open http://localhost:3000/connect to scan WhatsApp QR")

	if err := r.Run(":" + config.Cfg.Port); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}
