import { Agent } from "./types";

export const statusStyles: Record<
  Agent["status"],
  { badge: string; text: string }
> = {
  ONLINE: {
    badge: "bg-green-500/15 text-green-400",
    text: "Online",
  },
  OFFLINE: {
    badge: "bg-red-500/15 text-red-400",
    text: "Offline",
  },
}