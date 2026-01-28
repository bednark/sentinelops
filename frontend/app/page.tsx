import AgentsSummary from "@/components/agents/AgentsSummary";
import AgentsTable from "@/components/agents/AgentsTable";
import PageHeader from "@/components/layout/PageHeader";
import client from "@/lib/apollo-client";
import { gql } from "@apollo/client";
import { Agent } from "@/lib/types";

export default async function DashboardPage() {
  const { data } = await client.query<{ agents: Agent[] }>({
    query: gql`
      query {
        agents {
          name
          hostname
          os
          status
          lastSeen
        }
      }
    `,
  });

  const agents = data?.agents ?? [];

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 pb-10 pt-6">
      <PageHeader
        title="Panel główny"
        description="Przegląd wszystkich monitorowanych agentów"
      />
      <AgentsSummary />
      <div className="flex-1 min-h-0">
        <AgentsTable agents={agents} />
      </div>
    </div>
  );
}
