package repositories

import (
	"github.com/atp-chatbot/backend/db"
	"github.com/atp-chatbot/backend/models"
)

func ListReplies(userID uint) ([]models.AutoReply, error) {
	var rules []models.AutoReply
	err := db.DB.Where("user_id = ?", userID).Order("created_at desc").Find(&rules).Error
	return rules, err
}

func ListActiveReplies(userID uint) ([]models.AutoReply, error) {
	var rules []models.AutoReply
	err := db.DB.Where("is_active = true AND user_id = ?", userID).Find(&rules).Error
	return rules, err
}

func CreateReply(rule *models.AutoReply) error {
	return db.DB.Create(rule).Error
}

func FindReplyByIDAndUser(id string, userID uint) (models.AutoReply, error) {
	var rule models.AutoReply
	err := db.DB.Where("id = ? AND user_id = ?", id, userID).First(&rule).Error
	return rule, err
}

func UpdateReply(rule *models.AutoReply, updates map[string]interface{}) error {
	return db.DB.Model(rule).Updates(updates).Error
}

func DeleteReply(id string, userID uint) error {
	return db.DB.Where("id = ? AND user_id = ?", id, userID).Delete(&models.AutoReply{}).Error
}
