import { IsEnum, IsString, IsOptional } from 'class-validator';
import { AgentStatus } from './create-agent.dto';

export class UpdateAgentDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  hostname: string;

  @IsString()
  @IsOptional()
  os: string;

  @IsString()
  @IsOptional()
  agentToken: string;

  @IsEnum(AgentStatus)
  @IsOptional()
  status: AgentStatus;
}
