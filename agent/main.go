package main

import (
	"context"
	"log"
	"time"

	"github.com/bednark/sentinelops/agent/internal"
	metrics "github.com/bednark/sentinelops/agent/proto"

	// "google.golang.org/grpc"
	// "google.golang.org/grpc/credentials/insecure"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func main() {
	sender := internal.NewSender("localhost:50051")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	metricsToSend := []*metrics.Metric{
		{
			DeviceId:  "bfc00955-12fb-4791-b02c-f0eae895bd51",
			Name:      metrics.MetricName_CPU_USAGE,
			Value:     18.7,
			Timestamp: timestamppb.New(time.Date(2024, 3, 9, 12, 0, 0, 0, time.UTC)),
		},
		{
			DeviceId:  "bfc00955-12fb-4791-b02c-f0eae895bd51",
			Name:      metrics.MetricName_RAM_USAGE,
			Value:     61.2,
			Timestamp: timestamppb.Now(),
		},
		{
			DeviceId:  "bfc00955-12fb-4791-b02c-f0eae895bd51",
			Name:      metrics.MetricName_NET_RX,
			Value:     1311,
			Timestamp: timestamppb.Now(),
		},
	}

	err := sender.SendMetrics(ctx, metricsToSend)
	if err != nil {
		log.Println("send failed:", err)
		return
	}

	log.Println("metrics sent successfully")
}
