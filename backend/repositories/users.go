package repositories

import (
	"github.com/atp-chatbot/backend/db"
	"github.com/atp-chatbot/backend/models"
)

func FindUserByUsername(username string) (models.User, error) {
	var user models.User
	err := db.DB.Where("username = ?", username).First(&user).Error
	return user, err
}

func FindUserByID(id any) (models.User, error) {
	var user models.User
	err := db.DB.First(&user, id).Error
	return user, err
}

func CreateUser(user *models.User) error {
	return db.DB.Create(user).Error
}
