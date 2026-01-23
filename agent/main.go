package main

import (
	"context"
	"flag"
	"log"
	"time"

	"github.com/bednark/sentinelops/agent/internal"
	// "google.golang.org/grpc"
	// "google.golang.org/grpc/credentials/insecure"
)

func main() {
	configPath := flag.String(
		"config",
		"/etc/sentinelops/agent.json",
		"path to sentinelops agent config file",
	)

	flag.Parse()

	cfg, err := internal.LoadConfig(*configPath)
	if err != nil {
		log.Fatal("config error:", err)
	}

	sender := internal.NewSender(cfg.Server)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	metricsToSend, err := internal.CollectMetrics(cfg.DeviceID)
	if err != nil {
		log.Println("metric collection error:", err)
		return
	}

	if len(metricsToSend) == 0 {
		log.Println("no metrics collected, nothing to send")
		return
	}

	err = sender.SendMetrics(ctx, metricsToSend)
	if err != nil {
		log.Println("send failed:", err)
		return
	}

	log.Println("metrics sent successfully")
}
