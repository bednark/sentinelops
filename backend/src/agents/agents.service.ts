import {
  ConflictException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma, AgentStatus } from '../../generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import {
  UpdateAgentNameDto,
  UpdateAgentStatusDto,
} from './dto/update-agent.dto';
import { randomBytes, createHash } from 'crypto';

type AgentsStats = {
  total: number;
  online: number;
  offline: number;
};

@Injectable()
export class AgentsService {
  constructor(private prisma: PrismaService) {}

  private generateAgentToken(length = 20): string {
    return randomBytes(length).toString('base64url').slice(0, length);
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  findAll() {
    return this.prisma.agent.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        lastSeen: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.agent.findUnique({
      where: { id },
    });
  }

  async create(dto: CreateAgentDto) {
    const MAX_ATTEMPTS = 5;
    const normalizedName = dto.name.trim();

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const rawToken = this.generateAgentToken();
      const tokenHash = this.hashToken(rawToken);

      try {
        const agent = await this.prisma.agent.create({
          data: {
            name: normalizedName,
            hostname: '',
            os: '',
            agentToken: tokenHash,
          },
        });

        return {
          id: agent.id,
          name: agent.name,
          token: rawToken,
          createdAt: agent.createdAt,
        };
      } catch (e) {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === 'P2002'
        ) {
          const target = Array.isArray(
            (e.meta as { target?: unknown[] })?.target,
          )
            ? (e.meta as { target?: unknown[] }).target?.[0]
            : undefined;

          if (target === 'Agent_name_key') {
            throw new ConflictException(
              `Agent with name '${normalizedName}' already exists`,
            );
          }

          if (target === 'Agent_agentToken_key') {
            continue;
          }
        }

        throw e;
      }
    }

    throw new InternalServerErrorException(
      'Unable to generate unique agent token',
    );
  }

  async updateName(id: string, dto: UpdateAgentNameDto) {
    const normalizedName = dto.name.trim();

    try {
      await this.prisma.agent.update({
        where: { id },
        data: { name: normalizedName },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025')
          throw new NotFoundException(`Agent with id '${id}' not found`);

        if (e.code === 'P2002')
          throw new ConflictException(
            `Agent with name '${normalizedName}' already exists`,
          );
      }
      throw e;
    }
  }

  async updateStatus(id: string, dto: UpdateAgentStatusDto) {
    try {
      await this.prisma.agent.update({
        where: { id },
        data: { status: dto.status },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025')
          throw new NotFoundException(`Agent with id '${id}' not found`);
      }
      throw e;
    }
  }

  async updateToken(id: string) {
    const MAX_ATTEMPTS = 5;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const rawToken = this.generateAgentToken();
      const tokenHash = this.hashToken(rawToken);

      try {
        await this.prisma.agent.update({
          where: { id },
          data: { agentToken: tokenHash },
        });

        return {
          agentId: id,
          token: rawToken,
        };
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2025') {
            throw new NotFoundException(`Agent with id '${id}' not found`);
          }

          if (e.code === 'P2002') {
            const target = Array.isArray(
              (e.meta as { target?: unknown[] })?.target,
            )
              ? (e.meta as { target?: unknown[] }).target?.[0]
              : undefined;
            if (target === 'Agent_agentToken_key') {
              continue;
            }
          }
        }

        throw e;
      }
    }

    throw new InternalServerErrorException(
      'Unable to generate unique agent token',
    );
  }

  async delete(id: string) {
    try {
      await this.prisma.agent.delete({
        where: { id },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException(`Agent with id '${id}' not found`);
      }

      throw e;
    }
  }

  async agentsStats(): Promise<AgentsStats> {
    const grouped = await this.prisma.agent.groupBy({
      by: ['status'],
      _count: {
        _all: true,
      },
    });

    let online = 0;
    let offline = 0;

    for (const row of grouped) {
      if (row.status === AgentStatus.ONLINE) {
        online = row._count._all;
      }
      if (row.status === AgentStatus.OFFLINE) {
        offline = row._count._all;
      }
    }

    return {
      total: online + offline,
      online,
      offline,
    };
  }
}
