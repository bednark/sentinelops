jest.mock('src/prisma/prisma.service', () => ({ PrismaService: jest.fn() }), {
  virtual: true,
});

import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '../../generated/prisma/client';
import type { PrismaService as PrismaServiceType } from '../prisma/prisma.service';
import { PrismaService as PrismaServiceToken } from 'src/prisma/prisma.service';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import {
  UpdateAgentNameDto,
  UpdateAgentStatusDto,
} from './dto/update-agent.dto';
import { AgentStatus, type Agent } from '../../generated/prisma/client';

describe('AgentsService', () => {
  let service: AgentsService;
  type AgentDelegate = PrismaServiceType['agent'];
  type AgentDelegateMock = {
    findMany: jest.Mock<
      ReturnType<AgentDelegate['findMany']>,
      Parameters<AgentDelegate['findMany']>
    >;
    findUnique: jest.Mock<
      ReturnType<AgentDelegate['findUnique']>,
      Parameters<AgentDelegate['findUnique']>
    >;
    create: jest.Mock<
      ReturnType<AgentDelegate['create']>,
      Parameters<AgentDelegate['create']>
    >;
    update: jest.Mock<
      ReturnType<AgentDelegate['update']>,
      Parameters<AgentDelegate['update']>
    >;
    delete: jest.Mock<
      ReturnType<AgentDelegate['delete']>,
      Parameters<AgentDelegate['delete']>
    >;
    groupBy: jest.Mock<
      ReturnType<AgentDelegate['groupBy']>,
      Parameters<AgentDelegate['groupBy']>
    >;
  };

  let prisma: { agent: AgentDelegateMock };

  const createPrismaError = (code: string, meta?: Record<string, unknown>) =>
    new Prisma.PrismaClientKnownRequestError('error', {
      code,
      clientVersion: '7.0.0',
      meta,
    });

  beforeEach(async () => {
    prisma = {
      agent: {
        findMany: jest.fn<
          ReturnType<AgentDelegate['findMany']>,
          Parameters<AgentDelegate['findMany']>
        >(),
        findUnique: jest.fn<
          ReturnType<AgentDelegate['findUnique']>,
          Parameters<AgentDelegate['findUnique']>
        >(),
        create: jest.fn<
          ReturnType<AgentDelegate['create']>,
          Parameters<AgentDelegate['create']>
        >(),
        update: jest.fn<
          ReturnType<AgentDelegate['update']>,
          Parameters<AgentDelegate['update']>
        >(),
        delete: jest.fn<
          ReturnType<AgentDelegate['delete']>,
          Parameters<AgentDelegate['delete']>
        >(),
        groupBy: jest.fn<
          ReturnType<AgentDelegate['groupBy']>,
          Parameters<AgentDelegate['groupBy']>
        >(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgentsService,
        {
          provide: PrismaServiceToken,
          useValue: prisma as unknown as PrismaServiceType,
        },
      ],
    }).compile();

    service = module.get<AgentsService>(AgentsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('returns agents', async () => {
      const agents: Agent[] = [
        {
          id: '1',
          name: 'Agent 1',
          hostname: 'h1',
          os: 'linux',
          agentToken: 'token1',
          status: AgentStatus.ONLINE,
          lastSeen: null,
          createdAt: new Date(),
        },
      ];

      prisma.agent.findMany.mockResolvedValue(agents);

      const result = await service.findAll();

      expect(result).toEqual(agents);
      expect(prisma.agent.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('returns agent', async () => {
      const agent: Agent = {
        id: '1',
        name: 'Agent 1',
        hostname: 'h1',
        os: 'linux',
        agentToken: 'token1',
        status: AgentStatus.ONLINE,
        lastSeen: null,
        createdAt: new Date(),
      };
      prisma.agent.findUnique.mockResolvedValue(agent);

      const result = await service.findOne('1');

      expect(result).toEqual(agent);
    });

    it('returns null when missing', async () => {
      prisma.agent.findUnique.mockResolvedValue(null);

      const result = await service.findOne('x');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    const dto: CreateAgentDto = { name: 'Agent X' };

    it('creates agent and returns raw token', async () => {
      prisma.agent.create.mockResolvedValue({
        id: '1',
        name: 'Agent X',
        hostname: 'xxx',
        os: 'x',
        agentToken: 'xxxx',
        status: AgentStatus.OFFLINE,
        lastSeen: new Date(),
        createdAt: new Date(),
      });

      const result = await service.create(dto);

      expect(result.name).toBe('Agent X');
      expect(result.token).toHaveLength(20);

      const callData = prisma.agent.create.mock.calls[0][0].data;
      expect(callData.agentToken).not.toBe(result.token);
    });

    it('throws ConflictException on name duplicate', async () => {
      prisma.agent.create.mockRejectedValue(
        createPrismaError('P2002', { target: ['Agent_name_key'] }),
      );

      await expect(service.create(dto)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });
  });

  describe('updateName', () => {
    it('updates name', async () => {
      const updated: Agent = {
        id: '1',
        name: 'New Name',
        hostname: 'h1',
        os: 'linux',
        agentToken: 't1',
        status: AgentStatus.ONLINE,
        lastSeen: null,
        createdAt: new Date(),
      };
      prisma.agent.update.mockResolvedValue(updated);

      const dto: UpdateAgentNameDto = { name: 'New Name' };
      await service.updateName('1', dto);

      expect(prisma.agent.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { name: 'New Name' },
      });
    });

    it('throws NotFoundException', async () => {
      prisma.agent.update.mockRejectedValue(createPrismaError('P2025'));

      await expect(
        service.updateName('x', { name: 'A' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws ConflictException on duplicate', async () => {
      prisma.agent.update.mockRejectedValue(
        createPrismaError('P2002', { target: ['Agent_name_key'] }),
      );

      await expect(
        service.updateName('1', { name: 'Dup' }),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('updateStatus', () => {
    it('updates status', async () => {
      const updated: Agent = {
        id: '1',
        name: 'Agent 1',
        hostname: 'h1',
        os: 'linux',
        agentToken: 't1',
        status: AgentStatus.ONLINE,
        lastSeen: null,
        createdAt: new Date(),
      };
      prisma.agent.update.mockResolvedValue(updated);

      const dto: UpdateAgentStatusDto = { status: AgentStatus.ONLINE };
      await service.updateStatus('1', dto);

      expect(prisma.agent.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: AgentStatus.ONLINE },
      });
    });

    it('throws NotFoundException', async () => {
      prisma.agent.update.mockRejectedValue(createPrismaError('P2025'));

      await expect(
        service.updateStatus('x', { status: AgentStatus.OFFLINE }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('updateToken', () => {
    it('generates new token and stores hash', async () => {
      const updated: Agent = {
        id: '1',
        name: 'Agent 1',
        hostname: 'h1',
        os: 'linux',
        agentToken: 't1',
        status: AgentStatus.ONLINE,
        lastSeen: null,
        createdAt: new Date(),
      };
      prisma.agent.update.mockResolvedValue(updated);

      const result = await service.updateToken('1');

      expect(result.token).toHaveLength(20);

      const data = prisma.agent.update.mock.calls[0][0].data;
      expect(data.agentToken).not.toBe(result.token);
    });

    it('throws NotFoundException', async () => {
      prisma.agent.update.mockRejectedValue(createPrismaError('P2025'));

      await expect(service.updateToken('x')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('deletes agent', async () => {
      const deleted: Agent = {
        id: '1',
        name: 'Agent 1',
        hostname: 'h1',
        os: 'linux',
        agentToken: 't1',
        status: AgentStatus.OFFLINE,
        lastSeen: null,
        createdAt: new Date(),
      };
      prisma.agent.delete.mockResolvedValue(deleted);

      await service.delete('1');

      expect(prisma.agent.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('throws NotFoundException', async () => {
      prisma.agent.delete.mockRejectedValue(createPrismaError('P2025'));

      await expect(service.delete('x')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('agentsStats', () => {
    it('returns stats', async () => {
      prisma.agent.groupBy.mockResolvedValue([
        {
          id: '1',
          name: 'a',
          hostname: 'h1',
          os: 'linux',
          agentToken: 't1',
          status: AgentStatus.ONLINE,
          lastSeen: null,
          createdAt: new Date(),
          _count: {
            _all: 3,
            id: 0,
            name: 0,
            hostname: 0,
            os: 0,
            agentToken: 0,
            status: 0,
            lastSeen: 0,
            createdAt: 0,
          },
          _max: {},
          _min: {},
        },
        {
          id: '2',
          name: 'b',
          hostname: 'h2',
          os: 'linux',
          agentToken: 't2',
          status: AgentStatus.OFFLINE,
          lastSeen: null,
          createdAt: new Date(),
          _count: {
            _all: 2,
            id: 0,
            name: 0,
            hostname: 0,
            os: 0,
            agentToken: 0,
            status: 0,
            lastSeen: 0,
            createdAt: 0,
          },
          _max: {},
          _min: {},
        },
      ]);

      const result = await service.agentsStats();

      expect(result).toEqual({
        total: 5,
        online: 3,
        offline: 2,
      });
    });
  });
});
