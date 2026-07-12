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
	// Clients maps UserID -> whatsmeow.Client
	Clients   = make(map[uint]*whatsmeow.Client)
	currentQR = make(map[uint]string)
	mu        sync.RWMutex
	container *sqlstore.Container
)

// Init initialises the WhatsApp client using PostgreSQL for session storage.
// It fetches all stored devices and connects them.
func Init() error {
	dbLog := waLog.Stdout("WAStore", "WARN", true)
	ctx := context.Background()

	var err error
	container, err = sqlstore.New(ctx, "pgx", config.Cfg.WaDBURL, dbLog)
	if err != nil {
		return fmt.Errorf("failed to open WA store: %w", err)
	}

	// Currently, sqlstore doesn't expose a simple way to iterate all devices.
	// We'll rely on the dashboard login to lazy-load clients if they aren't loaded,
	// or we can fetch UserIDs from our DB and attempt to load devices.
	// For now, we'll just initialize the container. Bots will be booted when users log in.
	return nil
}

func GetUserClient(userID uint) *whatsmeow.Client {
	mu.RLock()
	defer mu.RUnlock()
	return Clients[userID]
}

// GenerateNewQR starts the login process and QR channel listener for a user
func GenerateNewQR(userID uint) error {
	if container == nil {
		return fmt.Errorf("store container not initialized")
	}

	mu.Lock()
	currentQR[userID] = ""

	// Create a new client for this user if it doesn't exist
	if Clients[userID] == nil {
		// Use a dedicated JID or identifier for the device store?
		// whatsmeow sqlstore assigns IDs sequentially (JID).
		// For true multi-tenant, we should ideally bind a device store to a user.
		// For simplicity, we just create a new device and map it in memory.
		deviceStore := container.NewDevice()
		clientLog := waLog.Stdout(fmt.Sprintf("WAClient-%d", userID), "WARN", true)
		client := whatsmeow.NewClient(deviceStore, clientLog)
		client.AddEventHandler(getEventHandler(userID, client))
		Clients[userID] = client
	}
	client := Clients[userID]
	mu.Unlock()

	ctx := context.Background()
	qrChan, _ := client.GetQRChannel(ctx)
	if err := client.Connect(); err != nil {
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
				currentQR[userID] = base64.StdEncoding.EncodeToString(png)
				mu.Unlock()
				log.Printf("📱 New QR code generated for user %d", userID)

			default:
				mu.Lock()
				currentQR[userID] = ""
				mu.Unlock()
				log.Printf("QR event for user %d: %s", userID, evt.Event)
			}
		}
	}()

	return nil
}

// GetQR returns the current QR code
func GetQR(userID uint) string {
	mu.RLock()
	defer mu.RUnlock()
	return currentQR[userID]
}

// IsConnected returns true when the WebSocket to WhatsApp is up.
func IsConnected(userID uint) bool {
	client := GetUserClient(userID)
	return client != nil && client.IsConnected()
}

// IsLoggedIn returns true when the session is fully authenticated.
func IsLoggedIn(userID uint) bool {
	client := GetUserClient(userID)
	return client != nil && client.IsLoggedIn()
}

// Disconnect gracefully closes all WhatsApp connections.
func Disconnect() {
	mu.RLock()
	defer mu.RUnlock()
	for _, client := range Clients {
		client.Disconnect()
	}
}

// LogoutAndReset completely logs out and prepares a fresh client for the user
func LogoutAndReset(userID uint) error {
	mu.Lock()
	client := Clients[userID]
	mu.Unlock()

	if client != nil {
		client.Logout(context.Background())
		client.Disconnect()
	}

	if container == nil {
		return fmt.Errorf("store container not initialized")
	}

	deviceStore := container.NewDevice()
	clientLog := waLog.Stdout(fmt.Sprintf("WAClient-%d", userID), "WARN", true)
	newClient := whatsmeow.NewClient(deviceStore, clientLog)
	newClient.AddEventHandler(getEventHandler(userID, newClient))

	mu.Lock()
	Clients[userID] = newClient
	mu.Unlock()

	return GenerateNewQR(userID)
}
