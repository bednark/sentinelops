import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

type RenameAgentDialogProps = {
  open: boolean;
  agentId?: string;
  currentName?: string;

  onConfirm: (agentId: string, newName: string) => Promise<void>;
  onClose: () => void;
};


export default function RenameDialog({
  open,
  agentId,
  currentName,
  onConfirm,
  onClose,
}: RenameAgentDialogProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setName(currentName ?? "");
      setError("");
    }
  }, [open, currentName]);

  const handleRename = async () => {
    if (!agentId) return;

    if (!name.trim()) {
      setError("Agent name cannot be empty");
      return;
    }

    if (name === currentName) {
      setError("New name must be different");
      return;
    }

    await onConfirm(agentId, name);
    onClose();
  };

  if (!agentId) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
        <DialogHeader>
          <DialogTitle>Zaktualizuj nazwę agenta</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label className="text-slate-200">Nowa nazwa</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-800 border-slate-700 text-slate-100"
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex justify-end space-x-2">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-slate-400"
            >
              Anuluj
            </Button>

            <Button
              onClick={handleRename}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!name.trim() || name === currentName}
            >
              Zapisz
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
