import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Agent = {
  name: string;
  hostname: string;
  os: string;
  status: "Online" | "Offline";
  lastSeen: string;
};

const agents: Agent[] = [
  { name: "Sentinel-01", hostname: "sentinel-01.local", os: "Ubuntu 22.04", status: "Online", lastSeen: "5 minut temu" },
  { name: "Sentinel-02", hostname: "sentinel-02.local", os: "Rocky Linux 9", status: "Online", lastSeen: "12 minut temu" },
  { name: "Edge-Gateway", hostname: "edge-gw.sentinelops", os: "Debian 12", status: "Offline", lastSeen: "25 minut temu" },
  { name: "DB-Primary", hostname: "db-primary.internal", os: "Ubuntu 20.04", status: "Offline", lastSeen: "2 godziny temu" },
  { name: "DB-Replica", hostname: "db-replica.internal", os: "Ubuntu 20.04", status: "Online", lastSeen: "35 minut temu" },
  { name: "Analytics-Node", hostname: "analytics-01.sentinelops", os: "Amazon Linux 2023", status: "Online", lastSeen: "18 minut temu" },
  { name: "Win-Agent", hostname: "win-agent.dc1", os: "Windows Server 2022", status: "Online", lastSeen: "45 minut temu" },
  { name: "Core-Router", hostname: "core-rtr.dc1", os: "Debian 11", status: "Online", lastSeen: "3 minuty temu" },
  { name: "Proxy-01", hostname: "proxy-01.sentinelops", os: "Ubuntu 22.04", status: "Offline", lastSeen: "4 godziny temu" },
  { name: "Proxy-02", hostname: "proxy-02.sentinelops", os: "Ubuntu 22.04", status: "Online", lastSeen: "27 minut temu" },
  { name: "Jump-Host", hostname: "jump-01.ops", os: "Rocky Linux 9", status: "Online", lastSeen: "8 minut temu" },
  { name: "CI-Runner-01", hostname: "ci-runner-01.ops", os: "Ubuntu 24.04", status: "Online", lastSeen: "2 minuty temu" },
  { name: "CI-Runner-02", hostname: "ci-runner-02.ops", os: "Ubuntu 24.04", status: "Offline", lastSeen: "6 godzin temu" },
  { name: "Web-Front-01", hostname: "web-01.sentinelops", os: "Amazon Linux 2023", status: "Online", lastSeen: "16 minut temu" },
  { name: "Web-Front-02", hostname: "web-02.sentinelops", os: "Amazon Linux 2023", status: "Offline", lastSeen: "1 godzinę temu" },
  { name: "Cache-01", hostname: "cache-01.internal", os: "Debian 12", status: "Online", lastSeen: "11 minut temu" },
  { name: "Cache-02", hostname: "cache-02.internal", os: "Debian 12", status: "Online", lastSeen: "9 minut temu" },
  { name: "MQ-01", hostname: "mq-01.internal", os: "Ubuntu 22.04", status: "Offline", lastSeen: "3 godziny temu" },
  { name: "Win-Collector", hostname: "win-collector.dc1", os: "Windows Server 2019", status: "Online", lastSeen: "33 minuty temu" },
  { name: "Audit-Node", hostname: "audit-01.sentinelops", os: "Rocky Linux 8", status: "Offline", lastSeen: "7 godzin temu" },
  { name: "DR-Backup", hostname: "dr-backup.sentinelops", os: "Ubuntu 20.04", status: "Online", lastSeen: "50 minut temu" },
];

const statusStyles: Record<
  Agent["status"],
  { badge: string; text: string }
> = {
  Online: {
    badge: "bg-green-500/15 text-green-400",
    text: "Online",
  },
  Offline: {
    badge: "bg-red-500/15 text-red-400",
    text: "Offline",
  },
};

export default function AgentsTable() {
  return (
    <Card className="flex h-full min-h-0 flex-col border border-slate-800 bg-slate-900 text-slate-100">
      <CardHeader className="border-b border-slate-800 px-6 py-4">
        <CardTitle className="text-lg font-semibold text-slate-50">
          Agenci
        </CardTitle>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 p-0">
        <div className="flex flex-1 min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
            <Table className="overflow-auto">
              <TableHeader className="sticky top-0 z-10 bg-slate-900">
                <TableRow className="border-b border-slate-800">
                  <TableHead className="w-[200px] text-slate-300">
                    Nazwa agenta
                  </TableHead>
                  <TableHead className="text-slate-300">
                    Nazwa hosta
                  </TableHead>
                  <TableHead className="text-slate-300">
                    System operacyjny
                  </TableHead>
                  <TableHead className="text-slate-300">
                    Status
                  </TableHead>
                  <TableHead className="text-right text-slate-300">
                    Ostatnio widziany
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {agents.map((agent) => {
                  const status = statusStyles[agent.status];

                  return (
                    <TableRow
                      key={agent.hostname}
                      className="border-b border-slate-800/70 hover:bg-slate-800/60"
                    >
                      <TableCell className="font-medium text-slate-100">
                        {agent.name}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {agent.hostname}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {agent.os}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`border-0 px-3 py-1 text-xs font-semibold ${status.badge}`}
                        >
                          {status.text}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-slate-400">
                        {agent.lastSeen}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
