package whatsapp

import (
	"context"
	"log"
	"strings"
	"time"

	"github.com/atp-chatbot/backend/db"
	"github.com/atp-chatbot/backend/models"
	"go.mau.fi/whatsmeow/proto/waE2E"
	"go.mau.fi/whatsmeow/types"
	"go.mau.fi/whatsmeow/types/events"
	"google.golang.org/protobuf/proto"
)

// handleEvent is registered with the whatsmeow client.
// It processes all incoming WhatsApp events.
func handleEvent(evt interface{}) {
	switch v := evt.(type) {
	case *events.Message:
		processMessage(v)
	}
}

func processMessage(evt *events.Message) {
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
	log.Printf("📩 Message from %s: %s", from, body)

	// Save to database
	record := models.Message{
		WaMessageID: evt.Info.ID,
		From:        from,
		Body:        body,
		ReceivedAt:  time.Now(),
	}
	if err := db.DB.Where("wa_message_id = ?", evt.Info.ID).FirstOrCreate(&record).Error; err != nil {
		log.Printf("DB error: %v", err)
		return
	}

	// Find matching auto-reply rule (case-insensitive contains)
	var rules []models.AutoReply
	db.DB.Where("is_active = true").Find(&rules)

	bodyLower := strings.ToLower(body)
	for _, rule := range rules {
		if strings.Contains(bodyLower, strings.ToLower(rule.Keyword)) {
			sendReply(evt.Info.Chat, rule.Reply)

			// Mark as replied
			db.DB.Model(&record).Updates(models.Message{
				Replied:   true,
				ReplyText: rule.Reply,
			})

			log.Printf("✅ Auto-replied to %s with rule '%s'", from, rule.Keyword)
			return
		}
	}

	log.Printf("⚠️  No rule matched for message from %s", from)
}

// sendReply sends a text message to the given JID.
func sendReply(to types.JID, text string) {
	if Client == nil || !Client.IsConnected() {
		log.Println("Cannot send reply: client not connected")
		return
	}

	_, err := Client.SendMessage(context.Background(), to, &waE2E.Message{
		Conversation: proto.String(text),
	})
	if err != nil {
		log.Printf("Failed to send reply: %v", err)
	}
}
