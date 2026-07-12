package models

import (
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// User represents an authenticated SaaS user
type User struct {
	ID           uint           `json:"id" gorm:"primaryKey;autoIncrement"`
	Username     string         `json:"username" gorm:"unique;not null"`
	PasswordHash string         `json:"-" gorm:"not null;default:''"` // Excluded from JSON
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `json:"-" gorm:"index"`
}

// CheckPassword compares a plaintext password with the hash
func (u *User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(password))
	return err == nil
}

// SetPassword hashes and sets the password
func (u *User) SetPassword(password string) error {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.PasswordHash = string(hash)
	return nil
}

// Message stores every incoming WhatsApp message
type Message struct {
	ID          uint           `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID      uint           `json:"user_id" gorm:"index;not null;default:0"` // The owner of this message
	WaMessageID string         `json:"wa_message_id" gorm:"uniqueIndex;not null"`
	BotPhone    string         `json:"bot_phone" gorm:"index"`       // the bot that received this message
	From        string         `json:"from" gorm:"not null"`         // sender's WhatsApp number
	Body        string         `json:"body" gorm:"not null"`         // message text
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
	UserID    uint           `json:"user_id" gorm:"index;not null;default:0"` // The owner of this rule
	Keyword   string         `json:"keyword" gorm:"not null"`                 // trigger keyword (case-insensitive)
	Reply     string         `json:"reply" gorm:"not null"`                   // reply message text
	IsActive  bool           `json:"is_active" gorm:"default:true"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}
