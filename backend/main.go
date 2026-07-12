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
	config.Load()
	db.Connect()

	if err := wa.Init(); err != nil {
		log.Fatalf("WhatsApp init error: %v", err)
	}

	go func() {
		c := make(chan os.Signal, 1)
		signal.Notify(c, os.Interrupt, syscall.SIGTERM)
		<-c
		log.Println("Shutting down...")
		wa.Disconnect()
		os.Exit(0)
	}()

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     config.Cfg.CORSAllowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	api := r.Group("/api")
	{
		api.POST("/register", handlers.Register)
		api.POST("/login", handlers.Login)
		api.POST("/auth/logout", handlers.AuthLogout)

		protected := api.Group("")
		protected.Use(middleware.RequireAuth())
		{
			protected.GET("/auth/me", handlers.CheckAuth)

			protected.GET("/qr", handlers.GetQR)
			protected.GET("/status", handlers.GetStatus)
			protected.POST("/logout", handlers.Logout)

			protected.GET("/replies", handlers.ListReplies)
			protected.POST("/replies", handlers.CreateReply)
			protected.PUT("/replies/:id", handlers.UpdateReply)
			protected.DELETE("/replies/:id", handlers.DeleteReply)

			protected.GET("/messages", handlers.ListMessages)
		}
	}

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	log.Printf("Server running on port %s (%s)", config.Cfg.Port, config.Cfg.AppEnv)
	log.Printf("Open %s/connect to scan the WhatsApp QR code", config.Cfg.FrontendURL)

	if err := r.Run(":" + config.Cfg.Port); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}
