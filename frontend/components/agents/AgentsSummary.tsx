import SummaryCard from "./SummaryCard"

export default function AgentsSummary() {
  const total = 21
  const online = 14
  const offline = total - online

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
