"use client";

import { Metric } from "@/lib/types";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useEffect } from "react";
import AgentMetric from "./AgentMetric";
import { Activity, HardDrive, NetworkIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from '@/components/ui/progress';

const AGENT_METRICS_QUERY = gql`
  query AgentMetrics($agentId: ID!) {
    cpu: metrics(agentId: $agentId, metricName: CPU_USAGE) {
      value
      timestamp
    },
    ram: metrics(agentId: $agentId, metricName: RAM_USAGE) {
      value
      timestamp
    },
    diskUsage: metrics(agentId: $agentId, metricName: DISK_USAGE) {
      value
      timestamp
    },
    diskRead: metrics(agentId: $agentId, metricName: DISK_READ) {
      value
      timestamp
    },
    diskWrite: metrics(agentId: $agentId, metricName: DISK_WRITE) {
      value
      timestamp
    },
    netRx: metrics(agentId: $agentId, metricName: NET_RX) {
      value
      timestamp
    },
    netTx: metrics(agentId: $agentId, metricName: NET_TX) {
      value
      timestamp
    },
  }
`;

type AgentRuntimeMetricsProps = {
  agentId: string;
  agentStatus: "ONLINE" | "OFFLINE";
}

type AgentMetricsResponse = {
  cpu: Metric[];
  ram: Metric[];
  diskUsage: Metric[];
  diskRead: Metric[];
  diskWrite: Metric[];
  netRx: Metric[];
  netTx: Metric[];
};

export default function AgentRuntimeMetrics({ agentId, agentStatus }: AgentRuntimeMetricsProps) {
  const isOffline = agentStatus === "OFFLINE";

  const { data, startPolling, stopPolling } = useQuery<AgentMetricsResponse>(AGENT_METRICS_QUERY, {
    variables: { agentId },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    skip: isOffline,
  });

  useEffect(() => {
    if (isOffline) {
      stopPolling();
      return;
    }

    startPolling(20000);
    return () => stopPolling();
  }, [isOffline, startPolling, stopPolling]);

  if (!data) return null;

  const diskUsagePercent =
    data.diskUsage.length > 0
      ? data.diskUsage[data.diskUsage.length - 1].value
      : 0;

  return (
    <>
      <AgentMetric
        title="Zużycie CPU"
        agentStatus={agentStatus}
        Icon={Activity}
        iconColor="text-blue-400"
        metrics={[
          {
            data: data.cpu,
            color: "#3b82f6",
            name: ""          }
        ]}
      />
      <AgentMetric
        title="Zużycie RAM"
        Icon={Activity}
        iconColor="text-purple-400"
        agentStatus={agentStatus}
        metrics={[
          {
            data: data.ram,
            color: "#a855f7",
            name: ""
          }
        ]}
      />

      <Card className="bg-slate-900 border-slate-800 p-6 relative">
        {isOffline && (
          <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center z-10 rounded-lg">
            <p className="text-slate-500 text-sm">No live data</p>
          </div>
        )}
        <div className="flex items-center mb-4">
          <HardDrive className="w-5 h-5 text-orange-400 mr-2" />
          <h3 className="text-lg text-slate-100">Miejsce na dysku</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">{diskUsagePercent.toFixed(0)}%</span>
          </div>
          <Progress value={diskUsagePercent} className="h-3" />
        </div>
      </Card>

      <AgentMetric
        title="Dysk I/O"
        Icon={HardDrive}
        iconColor="text-yellow-400"
        agentStatus={agentStatus}
        metrics={[
          {
            data: data.diskRead,
            color: "#eab308",
            name: "Odczyt (MB/s)"
          },
          {
            data: data.diskWrite,
            color: "#f97316",
            name: "Zapis (MB/s)"
          }
        ]}
      />
      <AgentMetric
        title="Obciążenie sieci"
        Icon={NetworkIcon}
        iconColor="text-green-400"
        agentStatus={agentStatus}
        metrics={[
          {
            data: data.netRx,
            color: "#10b981",
            name: "RX (Mbps)"
          },
          {
            data: data.netTx,
            color: "#06b6d4",
            name: "TX (Mbps)"
          }
        ]}
      />
    </>
  );
}