"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Server,
  Users,
  LogOut,
  Shield,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  {
    label: "Agenci",
    href: "/",
    icon: Server,
  },
  {
    label: "Administracja",
    icon: Shield,
    children: [
      {
        label: "Zarządzanie użytkownikami",
        href: "/administracja/uzytkownicy",
        icon: Users,
      },
      {
        label: "Zarządzanie agentami",
        href: "/administracja/agenci",
        icon: Server,
      },
    ],
  },
];

type AppSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export default function AppSidebar({ open, onClose }: AppSidebarProps) {
  const pathname = usePathname();
  const [adminOpen, setAdminOpen] = useState(
    pathname.startsWith("/administracja")
  );

  const currentUser = {
    name: "Jan Kowalski",
    role: "Administrator",
  };

  return (
    <aside
      className={cn(
        "fixed lg:static z-50 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 transition-transform",
        open ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0"
      )}
    >
      {/* LOGO / HEADER (desktop + mobile) */}
      <div className="flex h-16 items-center gap-2 px-6 text-white">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10">
          <Shield className="h-5 w-5 text-sky-400" />
        </div>
        <span className="text-lg font-semibold tracking-tight">
          SentinelOps
        </span>
      </div>

      {/* NAV */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            if (!item.children) {
              const active =
                pathname === item.href ||
                pathname.startsWith(item.href + "/");

              const Icon = item.icon;

              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-slate-900 text-white"
                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    )}
                  >
                    <Icon className="h-5 w-5 text-sky-400" />
                    {item.label}
                  </Link>
                </li>
              );
            }

            const isAdminActive = pathname.startsWith("/administracja");

            return (
              <li key={item.label}>
                <button
                  onClick={() => setAdminOpen((v) => !v)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isAdminActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-sky-400" />
                    {item.label}
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      adminOpen && "rotate-180"
                    )}
                  />
                </button>

                {adminOpen && (
                  <ul className="mt-1 space-y-1 pl-6">
                    {item.children.map((child) => {
                      const active = pathname === child.href;

                      return (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={onClose}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                              active
                                ? "bg-slate-900 text-white"
                                : "text-slate-400 hover:bg-slate-900 hover:text-white"
                            )}
                          >
                            <child.icon className="h-4 w-4 text-sky-400" />
                            {child.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* USER CONTEXT */}
      <div className="border-t border-slate-800 p-4 space-y-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800">
            <Users className="h-5 w-5 text-slate-300" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium text-slate-200">
              {currentUser.name}
            </p>
            <p className="text-xs text-slate-400">
              {currentUser.role}
            </p>
          </div>
        </div>

        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-900 hover:text-white transition-colors">
          <LogOut className="h-5 w-5 text-slate-400" />
          Wyloguj
        </button>
      </div>
    </aside>
  );
}
