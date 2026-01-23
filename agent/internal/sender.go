package internal

import (
	"context"
	"errors"
	"sync"

	metrics "github.com/bednark/sentinelops/agent/proto"

	"google.golang.org/grpc"
	"google.golang.org/grpc/connectivity"
	"google.golang.org/grpc/credentials/insecure"
	// "google.golang.org/protobuf/types/known/timestamppb"
)

type Sender struct {
	mu     sync.Mutex
	addr   string
	conn   *grpc.ClientConn
	client metrics.MetricsIngestServiceClient
}

func NewSender(addr string) *Sender {
	return &Sender{addr: addr}
}

func (s *Sender) connect(ctx context.Context) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if s.conn != nil {
		state := s.conn.GetState()
		if state == connectivity.Ready || state == connectivity.Idle {
			return nil
		}
	}

	conn, err := grpc.NewClient(
		s.addr,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)

	if err != nil {
		return err
	}

	state := conn.GetState()

	if state == connectivity.Idle {
		conn.Connect()
	}

	for state != connectivity.Ready {
		if !conn.WaitForStateChange(ctx, state) {
			_ = conn.Close()
			return ctx.Err()
		}

		state = conn.GetState()

		if state == connectivity.TransientFailure || state == connectivity.Shutdown {
			_ = conn.Close()
			return errors.New("grpc connection failed")
		}
	}

	s.conn = conn
	s.client = metrics.NewMetricsIngestServiceClient(conn)
	return nil
}

func (s *Sender) reset() {
	s.mu.Lock()
	defer s.mu.Unlock()

	if s.conn != nil {
		_ = s.conn.Close()
	}

	s.conn = nil
	s.client = nil
}

func (s *Sender) SendMetrics(
	ctx context.Context,
	metricsToSend []*metrics.Metric,
) error {
	if err := s.connect(ctx); err != nil {
		return err
	}

	stream, err := s.client.StreamMetrics(ctx)
	if err != nil {
		s.reset()
		return err
	}

	for _, m := range metricsToSend {
		if err := stream.Send(m); err != nil {
			s.reset()
			return err
		}
	}

	_, err = stream.CloseAndRecv()
	if err != nil {
		s.reset()
		return err
	}

	return nil
}
