'use client';

import { Agent } from "@/lib/types";
import AgentStatus from "./AgentStatus";
import { statusStyles } from "@/lib/data";
import { formatRelativeTime } from "@/lib/functions";

type AgentDetailsProps = {
  agent: Agent
}

export default function AgentDetails({ agent }: AgentDetailsProps) {
  const styles = statusStyles[agent.status];

  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-xl sm:text-3xl text-slate-100 mb-2">
          {agent.name}
        </h1>
        <div className="space-y-1 text-sm">
          <p className="text-slate-400">
            <span className="text-slate-500">Hostname: </span>
            {agent.hostname}
          </p>
          <p className="text-slate-400">
            <span className="text-slate-500">OS: </span>
            {agent.os}
          </p>
          <p className="text-slate-400">
            <span className="text-slate-500">Ostatnio widziany: </span>
            {agent.lastSeen ? formatRelativeTime(agent.lastSeen) : "Nigdy"}
          </p>
        </div>
      </div>
      <div>
        <AgentStatus styles={styles} />
      </div>
    </div>
  )
}