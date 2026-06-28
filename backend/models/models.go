package models

import (
	"time"

	"gorm.io/gorm"
)

// Message stores every incoming WhatsApp message
type Message struct {
	ID          uint           `json:"id" gorm:"primaryKey;autoIncrement"`
	WaMessageID string         `json:"wa_message_id" gorm:"uniqueIndex;not null"`
	From        string         `json:"from" gorm:"not null"`        // sender's WhatsApp number
	Body        string         `json:"body" gorm:"not null"`        // message text
	Replied     bool           `json:"replied" gorm:"default:false"` // whether bot replied
	ReplyText   string         `json:"reply_text"`                   // what bot replied
	ReceivedAt  time.Time      `json:"received_at"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

// AutoReply is a keyword → reply rule
type AutoReply struct {
	ID        uint           `json:"id" gorm:"primaryKey;autoIncrement"`
	Keyword   string         `json:"keyword" gorm:"not null"`     // trigger keyword (case-insensitive)
	Reply     string         `json:"reply" gorm:"not null"`        // reply message text
	IsActive  bool           `json:"is_active" gorm:"default:true"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}
