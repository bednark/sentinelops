package internal

import (
	"time"

	"github.com/shirou/gopsutil/v3/cpu"
	"github.com/shirou/gopsutil/v3/disk"
	"github.com/shirou/gopsutil/v3/mem"
	"github.com/shirou/gopsutil/v3/net"

	metrics "github.com/bednark/sentinelops/agent/proto"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func CollectMetrics(deviceID string) ([]*metrics.Metric, error) {
	now := timestamppb.New(time.Now())
	var result []*metrics.Metric

	cpuPercents, err := cpu.Percent(0, false)
	if err == nil && len(cpuPercents) > 0 {
		result = append(result, &metrics.Metric{
			DeviceId:  deviceID,
			Name:      metrics.MetricName_CPU_USAGE,
			Value:     cpuPercents[0],
			Timestamp: now,
		})
	}

	vm, err := mem.VirtualMemory()
	if err == nil {
		result = append(result, &metrics.Metric{
			DeviceId:  deviceID,
			Name:      metrics.MetricName_RAM_USAGE,
			Value:     vm.UsedPercent,
			Timestamp: now,
		})
	}

	du, err := disk.Usage("/")
	if err == nil {
		result = append(result, &metrics.Metric{
			DeviceId:  deviceID,
			Name:      metrics.MetricName_DISK_USAGE,
			Value:     du.UsedPercent,
			Timestamp: now,
		})
	}

	ioCounters, err := disk.IOCounters()
	if err == nil {
		var readBytes uint64
		var writeBytes uint64

		for _, stat := range ioCounters {
			readBytes += stat.ReadBytes
			writeBytes += stat.WriteBytes
		}

		result = append(result,
			&metrics.Metric{
				DeviceId:  deviceID,
				Name:      metrics.MetricName_DISK_READ,
				Value:     float64(readBytes),
				Timestamp: now,
			},
			&metrics.Metric{
				DeviceId:  deviceID,
				Name:      metrics.MetricName_DISK_WRITE,
				Value:     float64(writeBytes),
				Timestamp: now,
			},
		)
	}

	netIO, err := net.IOCounters(false)
	if err == nil && len(netIO) > 0 {
		result = append(result,
			&metrics.Metric{
				DeviceId:  deviceID,
				Name:      metrics.MetricName_NET_RX,
				Value:     float64(netIO[0].BytesRecv),
				Timestamp: now,
			},
			&metrics.Metric{
				DeviceId:  deviceID,
				Name:      metrics.MetricName_NET_TX,
				Value:     float64(netIO[0].BytesSent),
				Timestamp: now,
			},
		)
	}

	return result, nil
}
