package whatsapp

import (
	"context"
	"log"
	"strings"
	"time"

	"github.com/atp-chatbot/backend/models"
	"github.com/atp-chatbot/backend/repositories"
	"go.mau.fi/whatsmeow"
	"go.mau.fi/whatsmeow/proto/waE2E"
	"go.mau.fi/whatsmeow/types"
	"go.mau.fi/whatsmeow/types/events"
	"google.golang.org/protobuf/proto"
)

// getEventHandler creates a closure for a specific user and client
func getEventHandler(userID uint, client *whatsmeow.Client) func(interface{}) {
	return func(evt interface{}) {
		switch v := evt.(type) {
		case *events.Message:
			processMessage(userID, client, v)
		}
	}
}

func processMessage(userID uint, client *whatsmeow.Client, evt *events.Message) {
	// Ignore messages from groups, status updates, and messages sent by us
	if evt.Info.Chat.Server == types.GroupServer ||
		evt.Info.Chat.Server == types.BroadcastServer ||
		evt.Info.IsFromMe {
		return
	}

	// Only handle plain text messages
	body := ""
	if evt.Message.GetConversation() != "" {
		body = evt.Message.GetConversation()
	} else if evt.Message.GetExtendedTextMessage() != nil {
		body = evt.Message.GetExtendedTextMessage().GetText()
	}

	if body == "" {
		return
	}

	from := evt.Info.Sender.String()
	log.Printf("📩 Message from %s (User %d): %s", from, userID, body)

	botPhone := ""
	if client != nil && client.Store != nil && client.Store.ID != nil {
		botPhone = client.Store.ID.User
	}

	// Save to database
	record := models.Message{
		UserID:      userID,
		WaMessageID: evt.Info.ID,
		BotPhone:    botPhone,
		From:        from,
		Body:        body,
		ReceivedAt:  time.Now(),
	}
	if err := repositories.FirstOrCreateMessage(&record); err != nil {
		log.Printf("DB error: %v", err)
		return
	}

	rules, err := repositories.ListActiveReplies(userID)
	if err != nil {
		log.Printf("DB error: %v", err)
		return
	}

	bodyLower := strings.ToLower(body)
	for _, rule := range rules {
		if strings.Contains(bodyLower, strings.ToLower(rule.Keyword)) {
			sendReply(client, evt.Info.Chat, rule.Reply)

			if err := repositories.MarkMessageReplied(&record, rule.Reply); err != nil {
				log.Printf("DB error: %v", err)
				return
			}

			log.Printf("✅ Auto-replied to %s with rule '%s'", from, rule.Keyword)
			return
		}
	}

	log.Printf("⚠️  No rule matched for message from %s", from)
}

// sendReply sends a text message to the given JID.
func sendReply(client *whatsmeow.Client, to types.JID, text string) {
	if client == nil || !client.IsConnected() {
		log.Println("Cannot send reply: client not connected")
		return
	}

	_, err := client.SendMessage(context.Background(), to, &waE2E.Message{
		Conversation: proto.String(text),
	})
	if err != nil {
		log.Printf("Failed to send reply: %v", err)
	}
}
