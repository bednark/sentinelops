package main

import (
	"context"
	"flag"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/bednark/sentinelops/agent/internal"
	// "google.golang.org/grpc"
	// "google.golang.org/grpc/credentials/insecure"
)

func getConfig() (string, string, string) {
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

	return cfg.Server, cfg.DeviceID, cfg.Token
}

func main() {
	server, deviceId, _ := getConfig()
	sender := internal.NewSender(server)

	ctx, stop := signal.NotifyContext(
		context.Background(),
		os.Interrupt,
		syscall.SIGTERM,
	)
	defer stop()

	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			log.Println("shutdown signal received, exiting")
			return
		case <-ticker.C:
			ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
			defer cancel()

			metricsToSend, err := internal.CollectMetrics(deviceId)
			if err != nil {
				log.Println("metric collection error:", err)
				cancel()
				continue
			}

			if len(metricsToSend) == 0 {
				log.Println("no metrics collected, nothing to send")
				cancel()
				continue
			}

			err = sender.SendMetrics(ctx, metricsToSend)
			if err != nil {
				log.Println("send failed:", err)
			} else {
				log.Println("metrics sent successfully")
			}

			cancel()
		}
	}
}
