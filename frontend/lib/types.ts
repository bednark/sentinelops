type AgentStatus = "ONLINE" | "OFFLINE";

export type Agent = {
  id: string;
  name: string;
  hostname: string;
  os: string;
  status: AgentStatus;
  lastSeen: string;
};

export type AgentSelect = {
  id: string;
  name: string;
  status: AgentStatus;
}

export type Metric = {
  value: number
  timestamp: string
}