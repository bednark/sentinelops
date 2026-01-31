import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMetricDto } from './dto/create-metric.dto';
import { Prisma, MetricName } from '../../generated/prisma/client';

class AgentNotFoundError extends Error {
  constructor(agentId?: string) {
    super(agentId ? `Agent ${agentId} not found` : 'Agent not found');
    this.name = 'AgentNotFoundError';
  }
}

@Injectable()
export class MetricsService {
  constructor(private prisma: PrismaService) {}

  async findAll(metricName: MetricName) {
    const since = new Date(Date.now() - 6 * 60 * 60 * 1000);

    try {
      return await this.prisma.metric.findMany({
        where: {
          name: metricName,
          timestamp: {
            gte: since,
          },
        },
        orderBy: { timestamp: 'desc' },
      });
    } catch {
      throw new InternalServerErrorException('Failed to fetch metrics');
    }
  }

  async findByAgent(metricName: MetricName, agentId: string) {
    const since = new Date(Date.now() - 30 * 60 * 1000);

    try {
      return await this.prisma.metric.findMany({
        where: {
          agentId,
          name: metricName,
          timestamp: {
            gte: since,
          },
        },
        orderBy: { timestamp: 'asc' },
      });
    } catch {
      throw new InternalServerErrorException(
        `Failed to fetch metrics for agent ${agentId}`,
      );
    }
  }

  async findAgent(agentId: string) {
    try {
      const agent = await this.prisma.agent.findUnique({
        where: { id: agentId },
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

      if (!agent) {
        throw new Error('Agent not found');
      }

      return agent;
    } catch {
      throw new InternalServerErrorException(
        `Failed to resolve agent ${agentId}`,
      );
    }
  }

  async create(dto: CreateMetricDto[]) {
    if (dto.length === 0) return 0;

    const agentId = dto[0].agentId;
    const now = new Date();

    try {
      const result = await this.prisma.$transaction([
        this.prisma.metric.createMany({
          data: dto.map((m) => ({
            agentId: m.agentId,
            name: m.name,
            value: m.value,
            timestamp: new Date(m.timestamp.seconds * 1000),
          })),
        }),

        this.prisma.agent.update({
          where: { id: agentId },
          data: { lastSeen: now },
        }),
      ]);

      return result[0].count;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2003') {
          throw new AgentNotFoundError();
        }
      }
      throw e;
    }
  }
}
