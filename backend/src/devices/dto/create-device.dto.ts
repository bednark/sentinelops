import { IsString } from 'class-validator';

export enum DeviceStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

export class CreateDeviceDto {
  @IsString()
  name: string;

  @IsString()
  hostname: string;

  @IsString()
  os: string;

  @IsString()
  agentToken: string;
}
