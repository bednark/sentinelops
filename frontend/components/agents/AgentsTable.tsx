"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

/* =======================
   TYPES & DATA
======================= */

type Agent = {
  name: string
  hostname: string
  os: string
  status: "Online" | "Offline"
  lastSeen: string
}

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
]

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
}

/* =======================
   COLUMNS
======================= */

const columns: ColumnDef<Agent>[] = [
  {
    accessorKey: "name",
    header: "Nazwa agenta",
    meta: { className: "" },
    cell: ({ row }) => (
      <span className="font-medium text-slate-100">
        {row.getValue("name")}
      </span>
    ),
  },
  {
    accessorKey: "hostname",
    header: "Nazwa hosta",
    meta: { className: "hidden md:table-cell" },
    cell: ({ row }) => row.getValue("hostname"),
  },
  {
    accessorKey: "os",
    header: "System operacyjny",
    meta: { className: "hidden sm:table-cell" },
    cell: ({ row }) => row.getValue("os"),
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: { className: "" },
    cell: ({ row }) => {
      const status = row.getValue<Agent["status"]>("status")
      const styles = statusStyles[status]

      return (
        <Badge
          variant="outline"
          className={`border-0 px-3 py-1 text-xs font-semibold ${styles.badge}`}
        >
          {styles.text}
        </Badge>
      )
    },
  },
  {
    accessorKey: "lastSeen",
    header: () => <div>Ostatnio widziany</div>,
    meta: { className: "hidden sm:table-cell" },
    cell: ({ row }) => row.getValue("lastSeen"),
  },
]

/* =======================
   COMPONENT
======================= */

export default function AgentsTable() {
  const table = useReactTable({
    data: agents,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  })

  return (
    <Card>
      <CardHeader className="border-b border-slate-800">
        <CardTitle>Agenci</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Brak danych
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* PAGINACJA */}
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Poprzednia
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Następna
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
