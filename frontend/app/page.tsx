import AgentsSummary from "@/components/agents/AgentsSummary";
import AgentsTable from "@/components/agents/AgentsTable";
import PageHeader from "@/components/layout/PageHeader";

export default async function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-4 pb-10 pt-6">
      <PageHeader
        title="Panel główny"
        description="Przegląd wszystkich monitorowanych agentów"
      />
      <AgentsSummary />
      <div className="flex-1 min-h-0">
        <AgentsTable />
      </div>
    </div>
  );
}
