import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMetricDto } from './dto/create-metric.dto';
import { Prisma } from '../../generated/prisma/client';

class DeviceNotFoundError extends Error {
  constructor(deviceId?: string) {
    super(deviceId ? `Device ${deviceId} not found` : 'Device not found');
    this.name = 'DeviceNotFoundError';
  }
}

@Injectable()
export class MetricsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMetricDto[]) {
    try {
      const result = await this.prisma.metric.createMany({
        data: dto.map((m) => ({
          deviceId: m.deviceId,
          name: m.name,
          value: m.value,
          timestamp: new Date(m.timestamp.seconds * 1000),
        })),
      });
      return result.count;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError)
        if (e.code === 'P2003')
          throw new DeviceNotFoundError();
      throw e;
    }
  }
}
