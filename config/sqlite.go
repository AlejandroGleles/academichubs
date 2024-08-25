package config

import (
	"os"

	"github.com/AlejandroGleles/academichub/schemas"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func InitializeSqlite() (*gorm.DB, error) {
	logger := GetLogger("sqlite")
	dbPath := "./db/main.db"
	//check if database file exists
	_, err := os.Stat(dbPath)
	if os.IsNotExist(err) {
		logger.Info("database file not found,creating...")
		//create the database file and directry
		err = os.MkdirAll("./db", os.ModePerm)
		if err != nil {
			return nil, err
		}
		file, err := os.Create(dbPath)
		if err != nil {
			return nil, err
		}
		file.Close()
	}
	//create DB and connect
	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})

	if err != nil {
		logger.Errorf("Sqlite openig error: %v", err)
		return nil, err
	}
	//migrate the schemas
	err = db.AutoMigrate(&schemas.Aluno{}, &schemas.Professor{}, &schemas.Atividade{}, &schemas.Turma{}, &schemas.Nota{})
	if err != nil {
		logger.Errorf("sqlite automigration error: %v", err)
		return nil, err
	}
	//return the DB
	return db, nil

}
