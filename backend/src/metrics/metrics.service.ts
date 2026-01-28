import { Injectable, InternalServerErrorException } from '@nestjs/common';
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

  async findAll() {
    try {
      return await this.prisma.metric.findMany({
        orderBy: { timestamp: 'desc' },
      });
    } catch {
      throw new InternalServerErrorException('Failed to fetch metrics');
    }
  }

  async findByDevice(agentId: string) {
    try {
      return await this.prisma.metric.findMany({
        where: { agentId },
        orderBy: { timestamp: 'desc' },
      });
    } catch {
      throw new InternalServerErrorException(
        `Failed to fetch metrics for device ${agentId}`,
      );
    }
  }

  async findDevice(deviceId: string) {
    try {
      const device = await this.prisma.agent.findUnique({
        where: { id: deviceId },
        select: {
          id: true,
          name: true,
          hostname: true,
          os: true,
          status: true,
          lastSeen: true,
          createdAt: true,
        },
      });

      if (!device) {
        throw new Error('Device not found');
      }

      return device;
    } catch {
      throw new InternalServerErrorException(
        `Failed to resolve device ${deviceId}`,
      );
    }
  }

  async create(dto: CreateMetricDto[]) {
    try {
      const result = await this.prisma.metric.createMany({
        data: dto.map((m) => ({
          agentId: m.deviceId,
          name: m.name,
          value: m.value,
          timestamp: new Date(m.timestamp.seconds * 1000),
        })),
      });
      return result.count;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError)
        if (e.code === 'P2003') throw new DeviceNotFoundError();
      throw e;
    }
  }
}
