"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Server, CheckCircle, XCircle } from "lucide-react";
import { useEffect } from "react";

type SummaryCardProps = {
  title: string
  value: number | string
  accent?: "default" | "success" | "danger"
}

function SummaryCard({
  title,
  value,
  accent = "default",
}: SummaryCardProps) {
  const accentConfig = {
    default: {
      text: "text-slate-100",
      bg: "bg-slate-800/80",
      icon: Server,
    },
    success: {
      text: "text-green-400",
      bg: "bg-green-500/15",
      icon: CheckCircle,
    },
    danger: {
      text: "text-red-400",
      bg: "bg-red-500/15",
      icon: XCircle,
    },
  }[accent]

  const Icon = accentConfig.icon

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-slate-400">
            {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex w-full justify-between">
          <div className={`sm:text-3xl font-bold ${accentConfig.text}`}>
            {value}
          </div>
          <div>
            <Icon className={`h-6 w-6 ${accentConfig.text}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface IAgentsSummaryProps {
  stats: {
    total: number | string
    online: number | string
    offline: number | string
  }
}

const AGENTS_QUERY = gql`
  query AgentsSummary {
      agentsStats {
      total
      online
      offline
    }
  }
`;

type AgentsStatsQueryResponse = {
  agentsStats: {
    total: number;
    online: number;
    offline: number;
  };
};

export default function AgentsSummary() {
  const { data, startPolling, stopPolling } = useQuery<AgentsStatsQueryResponse>(AGENTS_QUERY, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    startPolling(20000);
    return () => stopPolling();
  }, [startPolling]);

  const stats = {
    total: data?.agentsStats?.total ?? 'N/A',
    online: data?.agentsStats?.online ?? 'N/A',
    offline: data?.agentsStats?.offline ?? 'N/A',
  }
  const { total, online, offline }  = stats

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-4
        sm:grid-cols-2
        lg:grid-cols-3
      "
    >
      <SummaryCard
        title="Łącznie serwerów"
        value={total}
      />
      <SummaryCard
        title="Online"
        value={online}
        accent="success"
      />
      <SummaryCard
        title="Offline"
        value={offline}
        accent="danger"
      />
    </div>
  )
}
