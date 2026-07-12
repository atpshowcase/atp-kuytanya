package repositories

import (
	"github.com/atp-chatbot/backend/db"
	"github.com/atp-chatbot/backend/models"
)

func ListRecentMessages(userID uint, limit int) ([]models.Message, error) {
	var messages []models.Message
	err := db.DB.Where("user_id = ?", userID).Order("received_at desc").Limit(limit).Find(&messages).Error
	return messages, err
}

func FirstOrCreateMessage(message *models.Message) error {
	return db.DB.Where("wa_message_id = ?", message.WaMessageID).FirstOrCreate(message).Error
}

func MarkMessageReplied(message *models.Message, replyText string) error {
	return db.DB.Model(message).Updates(models.Message{
		Replied:   true,
		ReplyText: replyText,
	}).Error
}
