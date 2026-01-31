import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Copy,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";

type RotateAgentTokenDialogProps = {
  step: "confirm" | "token" | null;
  agentId?: string;
  agentName?: string;
  token?: string;

  onConfirm: (agentId: string) => Promise<void>;
  onClose: () => void;
};

export default function RotateAgentTokenDialog({
  step,
  agentId,
  agentName,
  token,
  onConfirm,
  onClose,
}: RotateAgentTokenDialogProps) {
  const [tokenVisible, setTokenVisible] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);

  if (!step) return null;

  const maskedToken =
    tokenVisible && token ? token : token ? "•".repeat(token.length) : "";

  const copyToken = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setTokenCopied(true);
    setTimeout(() => setTokenCopied(false), 2000);
  };

  if (step === "confirm") {
    if (!agentId) return null;

    return (
      <AlertDialog open onOpenChange={(v) => !v && onClose()}>
        <AlertDialogContent className="bg-slate-900 border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-slate-100">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
              Wygeneruj nowy token
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Ta akcja spowoduje wygenerowanie nowego tokenu dla agenta i natychmiastowo wygasi aktualny.
              <br />
              <br />
              <span className="text-yellow-400 font-medium">
                Agent "{agentName}" zostanie rozłączony i będzie wymagał rekonfiguracji.
              </span>
              <br />
              <br />
              Nowy token zostanie wyświetlony jednorazowo.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 cursor-pointer"
              onClick={onClose}
            >
              Anuluj
            </AlertDialogCancel>

            <Button
              className="bg-yellow-600 hover:bg-yellow-700 text-white cursor-pointer"
              onClick={() => onConfirm(agentId)}
            >
              Wygeneruj
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  if (step === "token") {
    if (!token) return null;

    return (
      <Dialog open onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
              Token wygenerowany
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Token wyświetlony jest jednorazowo. Skopiuj go i bezpiecznie zapisz.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="bg-slate-800 border border-yellow-400/20 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-2">
                Agent: <span className="text-slate-200">{agentName}</span>
              </p>

              <div className="bg-slate-950 rounded p-3 mb-3 relative">
                <code className="text-xs text-slate-300 font-mono break-all">
                  {maskedToken}
                </code>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTokenVisible(!tokenVisible)}
                  className="absolute top-2 right-2 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {tokenVisible ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <Button
                onClick={copyToken}
                className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
              >
                {tokenCopied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Skopiowano
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Skopiuj token
                  </>
                )}
              </Button>
            </div>

            <div className="text-xs text-slate-500 space-y-1">
              <p>• Przechowuj token w bezpiecznym miejscu</p>
              <p>• SentinelOps nigdy ponownie nie wyświetli tokenu</p>
              <p>• Przekonfiguruj agenta zanim zamkniesz to okno</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
}
