import AgentDetails from "@/components/agents/AgentDetails";
import AgentRuntimeMetrics from "@/components/agents/AgentRuntimeMetrics";
import AgentsSelector from "@/components/agents/AgentsSelector";
import { Button } from "@/components/ui/button";
import client from "@/lib/apollo-client";
import { Agent, AgentSelect, Metric } from "@/lib/types";
import { gql } from "@apollo/client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AgentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const { data } = await client.query<{
    agent: Agent;
    agents: AgentSelect[];
  }>({
    query: gql`
      query AgentWithMetrics($agentId: ID!) {
        agent(id: $agentId) {
          name
          hostname
          os
          status
          lastSeen
        },
        agents {
          id,
          name,
          status
        }
      }
    `,
    variables: {
      agentId: id,
    },
  });

  const agents: AgentSelect[] = data?.agents ?? [];

  let agent: Agent = {
    id: "",
    name: "",
    hostname: "",
    os: "",
    status: "OFFLINE",
    lastSeen: "",
  }

  if(data?.agent)
    agent = data.agent

  return (
    <div className="p-8">
      <div className="mb-8">
        <Button
          asChild
          variant="ghost"
          className="mb-4 text-slate-400 hover:text-slate-200"
        >
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Powrót
          </Link>
        </Button>
        
        <AgentDetails agent={agent} />
        <AgentsSelector agents={agents} agent={{ id: id, name: agent.name, status: agent.status }} />
      </div>
      <div className="space-y-6">
        <AgentRuntimeMetrics
          agentStatus={agent.status}
          agentId={id}
        />
      </div>
    </div>
  );
}
