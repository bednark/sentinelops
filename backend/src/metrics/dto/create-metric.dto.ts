import {
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
  Min,
  IsOptional,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum MetricName {
  CPU_USAGE = 'CPU_USAGE',
  RAM_USAGE = 'RAM_USAGE',
  DISK_USAGE = 'DISK_USAGE',
  DISK_READ = 'DISK_READ',
  DISK_WRITE = 'DISK_WRITE',
  NET_RX = 'NET_RX',
  NET_TX = 'NET_TX',
}

class TimestampDto {
  @IsInt()
  @Min(0)
  seconds: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  nanos?: number;
}

export class CreateMetricDto {
  @IsString()
  agentId: string;

  @IsEnum(MetricName)
  name: MetricName;

  @IsNumber()
  value: number;

  @ValidateNested()
  @Type(() => TimestampDto)
  timestamp: TimestampDto;
}
