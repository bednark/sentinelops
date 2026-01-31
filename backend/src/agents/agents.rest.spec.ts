jest.mock('src/prisma/prisma.service', () => ({ PrismaService: jest.fn() }), {
  virtual: true,
});

import { Test, TestingModule } from '@nestjs/testing';
import { AgentsRestController } from './agents.rest';
import { AgentsService } from './agents.service';
import { AgentStatus } from '../../generated/prisma/client';
import { CreateAgentDto } from './dto/create-agent.dto';
import {
  UpdateAgentNameDto,
  UpdateAgentStatusDto,
} from './dto/update-agent.dto';

describe('AgentsRestController', () => {
  let controller: AgentsRestController;

  type AgentsServiceMock = {
    findAll: jest.MockedFunction<AgentsService['findAll']>;
    findOne: jest.MockedFunction<AgentsService['findOne']>;
    create: jest.MockedFunction<AgentsService['create']>;
    updateName: jest.MockedFunction<AgentsService['updateName']>;
    updateStatus: jest.MockedFunction<AgentsService['updateStatus']>;
    updateToken: jest.MockedFunction<AgentsService['updateToken']>;
    delete: jest.MockedFunction<AgentsService['delete']>;
  };

  let service: AgentsServiceMock;

  beforeEach(async () => {
    const serviceMock: AgentsServiceMock = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      updateName: jest.fn(),
      updateStatus: jest.fn(),
      updateToken: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgentsRestController],
      providers: [{ provide: AgentsService, useValue: serviceMock }],
    }).compile();

    controller = module.get<AgentsRestController>(AgentsRestController);
    service = module.get(AgentsService);
    jest.clearAllMocks();
  });

  it('returns all agents', async () => {
    const agents = [
      {
        id: '1',
        name: 'Agent 1',
        hostname: 'host1',
        os: 'linux',
        agentToken: 'token1',
        status: AgentStatus.ONLINE,
        lastSeen: null,
        createdAt: new Date(),
      },
    ];

    service.findAll.mockResolvedValue(agents);

    await expect(controller.getAgents()).resolves.toEqual(agents);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('returns a single agent', async () => {
    const agent = {
      id: '2',
      name: 'Agent 2',
      hostname: 'host2',
      os: 'linux',
      agentToken: 'token2',
      status: AgentStatus.OFFLINE,
      lastSeen: new Date(),
      createdAt: new Date(),
    };

    service.findOne.mockResolvedValue(agent);

    await expect(controller.getAgent('2')).resolves.toEqual(agent);
    expect(service.findOne).toHaveBeenCalledWith('2');
  });

  it('creates an agent', async () => {
    const dto: CreateAgentDto = { name: 'Agent 3' };

    service.create.mockResolvedValue({
      id: '3',
      name: 'Agent 3',
      token: 'rawtoken',
      createdAt: new Date(),
    });

    await expect(controller.createAgent(dto)).resolves.toBeDefined();
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('updates agent name', async () => {
    const dto: UpdateAgentNameDto = { name: 'New Name' };

    service.updateName.mockResolvedValue(undefined);

    await expect(controller.updateAgentName('1', dto)).resolves.toBeUndefined();

    expect(service.updateName).toHaveBeenCalledWith('1', dto);
  });

  it('updates agent status', async () => {
    const dto: UpdateAgentStatusDto = { status: AgentStatus.ONLINE };

    service.updateStatus.mockResolvedValue(undefined);

    await expect(
      controller.updateAgentStatus('1', dto),
    ).resolves.toBeUndefined();

    expect(service.updateStatus).toHaveBeenCalledWith('1', dto);
  });

  it('updates agent token', async () => {
    const result = { agentId: '1', token: 'newtoken' };

    service.updateToken.mockResolvedValue(result);

    await expect(controller.updateAgentToken('1')).resolves.toEqual(result);
    expect(service.updateToken).toHaveBeenCalledWith('1');
  });

  it('deletes an agent', async () => {
    service.delete.mockResolvedValue(undefined);

    await expect(controller.deleteAgent('4')).resolves.toBeUndefined();
    expect(service.delete).toHaveBeenCalledWith('4');
  });
});
