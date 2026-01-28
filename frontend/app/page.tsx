import AgentsSummary from "@/components/agents/AgentsSummary";
import AgentsTable from "@/components/agents/AgentsTable";
import PageHeader from "@/components/layout/PageHeader";
import client from "@/lib/apollo-client";
import { gql } from "@apollo/client";
import { Agent } from "@/lib/types";

export default async function DashboardPage() {
  const { data } = await client.query<{
    agents: Agent[]
    agentsStats: {
      total: number
      online: number
      offline: number
    }
  }>({
    query: gql`
      query {
        agents {
          name
          hostname
          os
          status
          lastSeen
        }
        agentsStats {
          total
          online
          offline
        }
      }
    `,
  })

  const agents = data?.agents ?? [];
  const stats = {
    total: data?.agentsStats?.total ?? 'N/A',
    online: data?.agentsStats?.online ?? 'N/A',
    offline: data?.agentsStats?.offline ?? 'N/A',
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 pb-10 pt-6">
      <PageHeader
        title="Panel główny"
        description="Przegląd wszystkich monitorowanych agentów"
      />
      <AgentsSummary stats={stats} />
      <div className="flex-1 min-h-0">
        <AgentsTable agents={agents} />
      </div>
    </div>
  );
}
