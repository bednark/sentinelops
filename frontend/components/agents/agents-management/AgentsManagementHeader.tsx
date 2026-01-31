import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function AgentsManagementHeader() {
  const [newAgentName, setNewAgentName] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [addError, setAddError] = useState('');
  const handleAddAgent = async () => {
  };

  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl text-slate-100 mb-2">Zarządzanie agentami</h1>
        <p className="text-slate-400">
          Zarządzaj agentami swojej infrastruktury
        </p>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Dodaj agenta
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-slate-100">Add New Agent</DialogTitle>
            <DialogDescription className="text-slate-400">
              Dodaj nowego agenta do monitorowania. Token zostanie wygenerowany automatycznie.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="agent-name" className="text-slate-200">
                Nazwa agenta
              </Label>
              <Input
                id="agent-name"
                value={newAgentName}
                onChange={(e) => setNewAgentName(e.target.value)}
                placeholder="web-server-01"
                className="bg-slate-800 border-slate-700 text-slate-100"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddAgent();
                }}
              />
            </div>
            {addError && (
              <p className="text-sm text-red-400">{addError}</p>
            )}
            <Button
              onClick={handleAddAgent}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!newAgentName.trim()}
            >
              Dodaj agenta
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}