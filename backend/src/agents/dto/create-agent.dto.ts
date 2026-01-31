import { IsString } from 'class-validator';

export class CreateAgentDto {
  @IsString()
  name: string;
}
