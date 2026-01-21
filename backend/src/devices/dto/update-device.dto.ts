import { IsEnum, IsString, IsOptional } from 'class-validator';
import { DeviceStatus } from './create-device.dto';

export class UpdateDeviceDto {
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

  @IsEnum(DeviceStatus)
  @IsOptional()
  status: DeviceStatus;
}
