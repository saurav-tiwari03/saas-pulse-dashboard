package main

import (
	"fmt"
	"log"

	"github.com/saurav-tiwari03/saas-pulse-dashboard/internal/config"
	router "github.com/saurav-tiwari03/saas-pulse-dashboard/internal/delivery/http"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Setup Gin router
	r := router.SetupRouter()

	// Start server
	addr := fmt.Sprintf(":%s", cfg.Port)
	log.Printf("🚀 Server starting on http://localhost%s", addr)
	log.Printf("📊 Try: GET http://localhost%s/api/events/stats", addr)

	if err := r.Run(addr); err != nil {
		log.Fatalf("❌ Server failed: %v", err)
	}
}
