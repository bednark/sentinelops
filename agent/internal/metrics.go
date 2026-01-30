package internal

import (
	"math"
	"time"

	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/disk"
	"github.com/shirou/gopsutil/v3/mem"
	"github.com/shirou/gopsutil/v3/net"

	metrics "github.com/bednark/sentinelops/agent/proto"
	"google.golang.org/protobuf/types/known/timestamppb"
)

var prevDiskRead uint64
var prevDiskWrite uint64
var prevNetRx uint64
var prevNetTx uint64
var prevTime time.Time

func round1(v float64) float64 {
	return math.Round(v*10) / 10
}

func CollectMetrics(agentID string) ([]*metrics.Metric, error) {
	nowTime := time.Now()
	now := timestamppb.New(nowTime)

	var result []*metrics.Metric

	if cpuPercents, err := cpu.Percent(0, false); err == nil && len(cpuPercents) > 0 {
		result = append(result, &metrics.Metric{
			AgentId:   agentID,
			Name:      metrics.MetricName_CPU_USAGE,
			Value:     round1(cpuPercents[0]),
			Timestamp: now,
		})
	}

	if vm, err := mem.VirtualMemory(); err == nil {
		result = append(result, &metrics.Metric{
			AgentId:   agentID,
			Name:      metrics.MetricName_RAM_USAGE,
			Value:     round1(vm.UsedPercent),
			Timestamp: now,
		})
	}

	if du, err := disk.Usage("/"); err == nil {
		result = append(result, &metrics.Metric{
			AgentId:   agentID,
			Name:      metrics.MetricName_DISK_USAGE,
			Value:     round1(du.UsedPercent),
			Timestamp: now,
		})
	}

	if ioCounters, err := disk.IOCounters(); err == nil {

		var readBytes uint64
		var writeBytes uint64

		for _, stat := range ioCounters {
			readBytes += stat.ReadBytes
			writeBytes += stat.WriteBytes
		}

		if !prevTime.IsZero() {
			dt := nowTime.Sub(prevTime).Seconds()

			if dt > 0 && readBytes >= prevDiskRead && writeBytes >= prevDiskWrite {

				readMBps := float64(readBytes-prevDiskRead) / dt / 1024 / 1024
				writeMBps := float64(writeBytes-prevDiskWrite) / dt / 1024 / 1024

				result = append(result,
					&metrics.Metric{
						AgentId:   agentID,
						Name:      metrics.MetricName_DISK_READ,
						Value:     round1(readMBps),
						Timestamp: now,
					},
					&metrics.Metric{
						AgentId:   agentID,
						Name:      metrics.MetricName_DISK_WRITE,
						Value:     round1(writeMBps),
						Timestamp: now,
					},
				)
			}
		}

		prevDiskRead = readBytes
		prevDiskWrite = writeBytes
	}

	if netIO, err := net.IOCounters(false); err == nil && len(netIO) > 0 {

		rx := netIO[0].BytesRecv
		tx := netIO[0].BytesSent

		if !prevTime.IsZero() {
			dt := nowTime.Sub(prevTime).Seconds()

			if dt > 0 && rx >= prevNetRx && tx >= prevNetTx {

				rxMbps := float64(rx-prevNetRx) * 8 / dt / 1_000_000
				txMbps := float64(tx-prevNetTx) * 8 / dt / 1_000_000

				result = append(result,
					&metrics.Metric{
						AgentId:   agentID,
						Name:      metrics.MetricName_NET_RX,
						Value:     round1(rxMbps),
						Timestamp: now,
					},
					&metrics.Metric{
						AgentId:   agentID,
						Name:      metrics.MetricName_NET_TX,
						Value:     round1(txMbps),
						Timestamp: now,
					},
				)
			}
		}

		prevNetRx = rx
		prevNetTx = tx
	}

	prevTime = nowTime

	return result, nil
}
