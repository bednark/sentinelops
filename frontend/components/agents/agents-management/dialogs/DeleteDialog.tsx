import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

type DeleteAgentDialogProps = {
  open: boolean;
  agentId?: string;
  agentName?: string;

  onConfirm: (agentId: string) => Promise<void>;
  onClose: () => void;
};

export default function DeleteAgentDialog({
  open,
  agentId,
  agentName,
  onConfirm,
  onClose,
}: DeleteAgentDialogProps) {
  if (!agentId) return null;

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent className="bg-slate-900 border-slate-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-slate-100 flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
            Usuń agenta
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="text-slate-400">
            Akcja spowoduje permanentne usunięcia agenta "{agentName}" i usunie wszystkie powiązane dane: 
            <br />
            <br />
            <ul className="list-disc list-inside space-y-1 text-slate-500">
              <li>Wszystkie metryki</li>
              <li>Wszystkie alarmy</li>
              <li>Konfigurację agenta</li>
            </ul>
            <br />
            <strong className="text-red-400">Ta akcja nie może zostać cofnięta.</strong>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700"
            onClick={onClose}
          >
            Anuluj
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(agentId)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Usuń
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}