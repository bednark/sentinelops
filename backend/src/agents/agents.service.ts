import {
  ConflictException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';

@Injectable()
export class AgentsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.agent.findMany();
  }

  async findOne(id: string) {
    try {
      return await this.prisma.agent.findUnique({
        where: { id },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          return null;
        }
      }

      throw new InternalServerErrorException(`Failed to fetch agent ${id}`);
    }
  }

  async create(dto: CreateAgentDto) {
    try {
      await this.prisma.agent.create({
        data: {
          name: dto.name,
          hostname: dto.hostname,
          os: dto.os,
          agentToken: dto.agentToken,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError)
        if (e.code === 'P2002')
          throw new ConflictException(
            `Agent with agentToken '${dto.agentToken}' already exists`,
          );

      throw e;
    }
  }

  async update(id: string, dto: UpdateAgentDto) {
    const data: Prisma.AgentUpdateInput = {};

    if (dto.name) data.name = dto.name;

    if (dto.hostname) data.hostname = dto.hostname;

    if (dto.os) data.os = dto.os;

    if (dto.agentToken) data.agentToken = dto.agentToken;

    if (dto.status) data.status = dto.status;

    try {
      await this.prisma.agent.update({
        where: { id },
        data,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025')
          throw new NotFoundException(`Agent with id '${id}' not found`);
        if (e.code === 'P2002')
          throw new ConflictException(
            `Agent with agentToken '${dto.agentToken}' already exists`,
          );
      }
      throw e;
    }
  }

  async delete(id: string) {
    try {
      await this.prisma.agent.delete({
        where: { id },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError)
        if (e.code === 'P2025')
          throw new NotFoundException(`Agent with id '${id}' not found`);

      throw e;
    }
  }
}
