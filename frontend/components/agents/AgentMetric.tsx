"use client";

import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { LucideIcon } from "lucide-react";
import { formatTimestamp } from "@/lib/functions";
import { Metric } from "@/lib/types";
import React from "react";

type AgentMetricProps = {
  title: string;
  agentStatus: "ONLINE" | "OFFLINE";
  Icon: LucideIcon;
  iconColor: string;
  metrics: {
    data: Metric[];
    color: string;
    name: string;
  }[];
};

export default function AgentMetric({ title, agentStatus, Icon, iconColor, metrics }: AgentMetricProps) {
  const isOffline = agentStatus === "OFFLINE";

  return (
    <Card className="bg-slate-900 border-slate-800 p-6 relative">
      {isOffline && (
        <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center z-10 rounded-lg">
          <p className="text-slate-500 text-sm">Agent offline</p>
        </div>
      )}

      <div className="flex items-center mb-4">
        <Icon className={`w-5 h-5 ${iconColor} mr-2`} />
        <h3 className="text-lg text-slate-100">{title}</h3>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatTimestamp}
            stroke="#64748b"
          />
          <YAxis domain={[0, 100]} stroke="#64748b" />
          <Tooltip
            labelFormatter={(label) => formatTimestamp(label as number)}
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "6px",
              color: "#e2e8f0",
            }}
          />

          {
            metrics.map((item, index) => (
              <React.Fragment key={index}>
                {item.name !== "" ? <Legend /> : ""}
                <Line
                  type="monotone"
                  data={item.data}
                  dataKey="value"
                  stroke={item.color}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                  name={item.name}
                />
              </React.Fragment>
            ))
          }
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
