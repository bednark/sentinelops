import { IsEnum, IsString, IsOptional } from 'class-validator';
import { AgentStatus } from '../../../generated/prisma/client';

export class UpdateAgentNameDto {
  @IsString()
  @IsOptional()
  name: string;
}

export class UpdateAgentStatusDto {
  @IsEnum(AgentStatus)
  @IsOptional()
  status: AgentStatus;
}
