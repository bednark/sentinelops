'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { AgentSelect } from "@/lib/types";
import { useRouter } from "next/navigation";

type AgentsSelectorProps = {
  agents: AgentSelect[];
  agent: AgentSelect;
}

export default function AgentsSelector({ agents, agent }: AgentsSelectorProps) {
  const router = useRouter();
  return (
    <div className="max-w-xs">
      <Select value={agent.id} onValueChange={(value) => router.push(`/agent/${value}`)}>
        <SelectTrigger className="bg-slate-900 border-slate-800 text-slate-100 w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-slate-800">
          {agents.map((a, i) => (
            <SelectItem
              key={i}
              value={a.id ? a.id : ""}
              className="text-slate-100 focus:bg-slate-800 focus:text-slate-100"
            >
              <div className="flex items-center space-x-2">
                <span>{a.name}</span>
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    a.status === 'ONLINE' ? 'bg-green-400' : 'bg-red-400'
                  }`}
                />
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}