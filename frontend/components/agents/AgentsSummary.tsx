import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Server, CheckCircle, XCircle } from "lucide-react"

type SummaryCardProps = {
  title: string
  value: number
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
