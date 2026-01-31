import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

type AgentsManagementHeaderProps = {
  open: boolean;
  addError?: string;
  isAdding: boolean

  onSubmit: (agentName: string) => Promise<void>;
  onOpen: () => void;
  onClose: () => void;
};

export default function AgentsManagementHeader({
  open,
  addError,
  onSubmit,
  onOpen,
  onClose,
  isAdding
}: AgentsManagementHeaderProps) {
  const [newAgentName, setNewAgentName] = useState("");

  useEffect(() => {
    if (!open) {
      setNewAgentName("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!newAgentName.trim()) return;
    await onSubmit(newAgentName.trim());
  };

  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl text-slate-100 mb-2">
          Zarządzanie agentami
        </h1>
        <p className="text-slate-400">
          Zarządzaj agentami swojej infrastruktury
        </p>
      </div>

      <Button
        className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
        onClick={onOpen}
      >
        <Plus className="w-4 h-4 mr-2" />
        Dodaj agenta
      </Button>

      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
          <DialogHeader>
            <DialogTitle className="text-slate-100">
              Dodaj nowego agenta
            </DialogTitle>
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
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
            </div>

            {addError && (
              <p className="text-sm text-red-400">{addError}</p>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                variant="ghost"
                className="text-slate-400 cursor-pointer"
                onClick={onClose}
              >
                Anuluj
              </Button>

              <Button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                disabled={!newAgentName.trim()}
              >
                {isAdding ? "Dodawanie..." : "Dodaj agenta"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
