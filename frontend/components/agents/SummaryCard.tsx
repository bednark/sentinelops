import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Server, CheckCircle, XCircle } from "lucide-react"

type SummaryCardProps = {
  title: string
  value: number
  accent?: "default" | "success" | "danger"
}

export default function SummaryCard({
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
    <Card className="w-full border border-slate-800 bg-slate-900 text-slate-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-400">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent
        className="
          relative
          flex
          items-center
          justify-between
          pt-2
          sm:block
        "
      >
        <div className={`text-3xl font-bold ${accentConfig.text}`}>
          {value}
        </div>
        <div
          className={`
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-xl
            ${accentConfig.bg}

            sm:absolute
            sm:right-4
            sm:top-1/2
            sm:-translate-y-1/2
          `}
        >
          <Icon className={`h-6 w-6 ${accentConfig.text}`} />
        </div>
      </CardContent>
    </Card>
  )
}
