import { Badge } from "@/components/ui/badge";

type AgentStatusProps = {
  styles: { badge: string; text: string }
}

export default function AgentStatus({ styles }: AgentStatusProps) {
  return (
    <Badge
      variant="outline"
      className={`border-0 px-3 py-1 text-xs font-semibold ${styles.badge}`}
    >
      {styles.text}
    </Badge>
  )
}