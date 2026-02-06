package main

import (
	"fmt"
	"log"

	"github.com/saurav-tiwari03/saas-pulse-dashboard/internal/config"
)

func main() {
	fmt.Println("Server is running")
	port := config.LoadEnv()
	log.Println("Server is running on port", port)
}
