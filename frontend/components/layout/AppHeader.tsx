"use client";

import { Menu, Shield, X } from "lucide-react";

export default function AppHeader({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <header className="fixed top-0 z-40 flex h-14 w-full items-center justify-between border-b border-slate-800 bg-slate-950 px-4 lg:hidden">
      <div className="flex items-center gap-2 text-white">
        <Shield className="h-5 w-5 text-sky-400" />
        <span className="font-semibold">SentinelOps</span>
      </div>
      <button
        onClick={onToggle}
        className="text-slate-300 transition-colors hover:text-white"
        aria-label={isOpen ? "Zamknij menu" : "Otwórz menu"}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>
    </header>
  );
}
