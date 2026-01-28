type AgentStatus = "ONLINE" | "OFFLINE";

export type Agent = {
  name: string;
  hostname: string;
  os: string;
  status: AgentStatus;
  lastSeen: string;
};