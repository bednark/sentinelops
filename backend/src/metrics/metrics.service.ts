import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMetricDto } from './dto/create-metric.dto';
import { Prisma } from '../../generated/prisma/client';

class AgentNotFoundError extends Error {
  constructor(agentId?: string) {
    super(agentId ? `Agent ${agentId} not found` : 'Agent not found');
    this.name = 'AgentNotFoundError';
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

  async findByAgent(agentId: string) {
    try {
      return await this.prisma.metric.findMany({
        where: { agentId },
        orderBy: { timestamp: 'desc' },
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
    try {
      const result = await this.prisma.metric.createMany({
        data: dto.map((m) => ({
          agentId: m.agentId,
          name: m.name,
          value: m.value,
          timestamp: new Date(m.timestamp.seconds * 1000),
        })),
      });
      return result.count;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError)
        if (e.code === 'P2003') throw new AgentNotFoundError();
      throw e;
    }
  }
}
