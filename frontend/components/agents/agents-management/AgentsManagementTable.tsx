import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, RotateCw, Trash2 } from "lucide-react";
import { AgentManagment } from "@/lib/types";

type AgentsManagementTableProps = {
  agents: AgentManagment[];

  onRename: (agent: { id: string; name: string }) => void;
  onRotateToken: (agent: { id: string; name: string }) => void;
  onDelete: (agent: { id: string; name: string }) => void;
}

export default function AgentsManagmentTable(
  {
    agents,
    onRename,
    onRotateToken,
    onDelete
  }: AgentsManagementTableProps) {
  return (
    <Card className="bg-slate-900 border-slate-800 overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs text-slate-400 uppercase tracking-wider">
                Nazwa
              </th>
              <th className="px-6 py-3 text-left text-xs text-slate-400 uppercase tracking-wider">
                Data dodania
              </th>
              <th className="px-6 py-3 text-left text-xs text-slate-400 uppercase tracking-wider">
                Akcje
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {agents.map((agent) => (
              <tr key={agent.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-100">
                  {agent.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                  {new Date(agent.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRename({ id: agent.id, name: agent.name })}
                      className="text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRotateToken({ id: agent.id, name: agent.name })}
                      className="text-yellow-400 hover:text-yellow-300 cursor-pointer"
                    >
                      <RotateCw className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete({ id: agent.id, name: agent.name })}
                      className="text-red-400 hover:text-red-300 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>  
  )
}