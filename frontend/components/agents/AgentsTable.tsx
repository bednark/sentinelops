"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Agent } from "@/lib/types";
import { statusStyles } from "@/lib/data";
import AgentStatus from "./AgentStatus";
import { formatRelativeTime } from "@/lib/functions";
import { useRouter } from "next/navigation";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useEffect } from "react";

const AGENTS_QUERY = gql`
  query Agents {
    agents {
      id
      name
      hostname
      os
      status
      lastSeen
    }
  }
`;

type AgentsQueryResponse = {
  agents: Agent[];
};

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
        <AgentStatus styles={styles} />
      )
    },
  },
  {
    accessorKey: "lastSeen",
    header: () => <div>Ostatnio widziany</div>,
    meta: { className: "hidden sm:table-cell" },
    cell: ({ row }) => row.getValue("lastSeen") ? formatRelativeTime(row.getValue("lastSeen")) : "Nigdy",
  },
]

export default function AgentsTable() {
  const { data, startPolling, stopPolling } = useQuery<AgentsQueryResponse>(AGENTS_QUERY, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const router = useRouter();

  useEffect(() => {
    startPolling(20000);
    return () => stopPolling();
  }, [startPolling]);

  let agents: Agent[] = data?.agents ?? [];

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
  });

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
                  <TableRow key={row.id} onClick={() => router.push(`/agent/${row.original.id}`)} className="cursor-pointer">
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
