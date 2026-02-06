package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port     string
	MongoURI string
	KafkaURL string
}

func Load() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system env")
	}

	return &Config{
		Port:     getEnv("PORT", "8080"),
		MongoURI: getEnv("MONGO_URI", ""),
		KafkaURL: getEnv("KAFKA_BROKERS", ""),
	}
}

func getEnv(key, fallback string) string {
	if val, ok := os.LookupEnv(key); ok {
		return val
	}
	return fallback
}
