import { IsString } from 'class-validator';

export enum AgentStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

export class CreateAgentDto {
  @IsString()
  name: string;

  @IsString()
  hostname: string;

  @IsString()
  os: string;

  @IsString()
  agentToken: string;
}
