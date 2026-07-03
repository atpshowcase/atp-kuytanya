package whatsapp

import (
	"context"
	"encoding/base64"
	"fmt"
	"log"
	"sync"

	"github.com/atp-chatbot/backend/config"
	"github.com/skip2/go-qrcode"
	"go.mau.fi/whatsmeow"
	"go.mau.fi/whatsmeow/store/sqlstore"
	waLog "go.mau.fi/whatsmeow/util/log"

	// PostgreSQL driver for whatsmeow session storage (no SQLite / no SQLITE_BUSY)
	_ "github.com/jackc/pgx/v5/stdlib"
)

var (
	Client    *whatsmeow.Client
	currentQR string
	mu        sync.RWMutex
	container *sqlstore.Container
)

// Init initialises the WhatsApp client using PostgreSQL for session storage.
// If this is the first run the client will generate a QR code.
// On subsequent runs it reconnects automatically using the stored session.
func Init() error {
	dbLog := waLog.Stdout("WAStore", "WARN", true)
	ctx := context.Background()

	// Use PostgreSQL — handles concurrent writes properly (no SQLITE_BUSY)
	var err error
	container, err = sqlstore.New(ctx, "pgx", config.Cfg.WaDBURL, dbLog)
	if err != nil {
		return fmt.Errorf("failed to open WA store: %w", err)
	}

	deviceStore, err := container.GetFirstDevice(ctx)
	if err != nil {
		deviceStore = container.NewDevice()
	}

	clientLog := waLog.Stdout("WAClient", "WARN", true)
	Client = whatsmeow.NewClient(deviceStore, clientLog)
	Client.AddEventHandler(handleEvent)

	if Client.Store.ID == nil {
		// ── First login: generate QR code ──────────────────────────────────
		if err := GenerateNewQR(); err != nil {
			return err
		}
	} else {
		// ── Already logged in: reconnect ────────────────────────────────────
		if err := Client.Connect(); err != nil {
			return fmt.Errorf("failed to reconnect: %w", err)
		}
		log.Println("✅ WhatsApp reconnected using saved session")
	}

	return nil
}

// GenerateNewQR starts the login process and QR channel listener
func GenerateNewQR() error {
	if Client == nil {
		return fmt.Errorf("client not initialized")
	}

	mu.Lock()
	currentQR = ""
	mu.Unlock()

	ctx := context.Background()
	qrChan, _ := Client.GetQRChannel(ctx)
	if err := Client.Connect(); err != nil {
		return fmt.Errorf("failed to connect: %w", err)
	}

	go func() {
		for evt := range qrChan {
			switch evt.Event {
			case "code":
				png, encErr := qrcode.Encode(evt.Code, qrcode.Medium, 256)
				if encErr != nil {
					log.Printf("QR encode error: %v", encErr)
					continue
				}
				mu.Lock()
				currentQR = base64.StdEncoding.EncodeToString(png)
				mu.Unlock()
				log.Println("📱 New QR code generated — open the dashboard to scan")

			default:
				// "success", "timeout", "error"
				mu.Lock()
				currentQR = ""
				mu.Unlock()
				log.Printf("QR event: %s", evt.Event)
			}
		}
	}()

	return nil
}

// GetQR returns the current QR code as a base64-encoded PNG string.
func GetQR() string {
	mu.RLock()
	defer mu.RUnlock()
	return currentQR
}

// IsConnected returns true when the WebSocket to WhatsApp is up.
func IsConnected() bool {
	return Client != nil && Client.IsConnected()
}

// IsLoggedIn returns true when the session is fully authenticated.
func IsLoggedIn() bool {
	return Client != nil && Client.IsLoggedIn()
}

// Disconnect gracefully closes the WhatsApp connection.
func Disconnect() {
	if Client != nil {
		Client.Disconnect()
	}
}

// LogoutAndReset completely logs out and prepares a fresh client
func LogoutAndReset() error {
	if Client != nil {
		// Wait for logout request to complete or ignore error if disconnected
		Client.Logout(context.Background())
		Client.Disconnect()
	}

	if container == nil {
		return fmt.Errorf("store container not initialized")
	}

	deviceStore := container.NewDevice()
	clientLog := waLog.Stdout("WAClient", "WARN", true)
	Client = whatsmeow.NewClient(deviceStore, clientLog)
	Client.AddEventHandler(handleEvent)

	return GenerateNewQR()
}
