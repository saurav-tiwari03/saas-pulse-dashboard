package main

import (
	"fmt"
	"log"
	"strings"

	"github.com/saurav-tiwari03/saas-pulse-dashboard/internal/config"
	router "github.com/saurav-tiwari03/saas-pulse-dashboard/internal/delivery/http"
	"github.com/saurav-tiwari03/saas-pulse-dashboard/internal/infrastructure/kafka"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Initialize Kafka producer
	brokers := strings.Split(cfg.KafkaURL, ",")
	producer := kafka.NewProducer(brokers, "analytics-events")
	defer producer.Close()

	// Setup Gin router
	r := router.SetupRouter(producer)

	// Start server
	addr := fmt.Sprintf(":%s", cfg.Port)
	log.Printf("🚀 Server starting on http://localhost%s", addr)
	log.Printf("📊 Try: GET http://localhost%s/api/events/stats", addr)

	if err := r.Run(addr); err != nil {
		log.Fatalf("❌ Server failed: %v", err)
	}
}
