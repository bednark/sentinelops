jest.mock('src/prisma/prisma.service', () => ({ PrismaService: jest.fn() }), {
  virtual: true,
});
import { Test, TestingModule } from '@nestjs/testing';
import { CreateAgentDto, AgentStatus } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { AgentsRestController } from './agents.rest';
import { AgentsService } from './agents.service';

describe('AgentsRestController', () => {
  let controller: AgentsRestController;
  type FindAll = AgentsService['findAll'];
  type FindOne = AgentsService['findOne'];
  type Create = AgentsService['create'];
  type Update = AgentsService['update'];
  type Delete = AgentsService['delete'];
  type AgentsServiceMock = {
    findAll: jest.MockedFunction<FindAll>;
    findOne: jest.MockedFunction<FindOne>;
    create: jest.MockedFunction<Create>;
    update: jest.MockedFunction<Update>;
    delete: jest.MockedFunction<Delete>;
  };
  let service: AgentsServiceMock;

  beforeEach(async () => {
    const serviceMock: AgentsServiceMock = {
      findAll: jest.fn<ReturnType<FindAll>, Parameters<FindAll>>(),
      findOne: jest.fn<ReturnType<FindOne>, Parameters<FindOne>>(),
      create: jest.fn<ReturnType<Create>, Parameters<Create>>(),
      update: jest.fn<ReturnType<Update>, Parameters<Update>>(),
      delete: jest.fn<ReturnType<Delete>, Parameters<Delete>>(),
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
    const agents: Awaited<ReturnType<FindAll>> = [
      {
        id: '1',
        name: 'Agent 1',
        hostname: 'host1',
        os: 'linux',
        agentToken: 'token1',
        status: 'ONLINE',
        lastSeen: null,
        createdAt: new Date(),
      },
    ];
    service.findAll.mockResolvedValue(agents);

    await expect(controller.getAgents()).resolves.toEqual(agents);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('returns a single agent', async () => {
    const agent: Awaited<ReturnType<FindOne>> = {
      id: '2',
      name: 'Agent 2',
      hostname: 'host2',
      os: 'linux',
      agentToken: 'token2',
      status: 'OFFLINE',
      lastSeen: new Date(),
      createdAt: new Date(),
    };
    service.findOne.mockResolvedValue(agent);

    await expect(controller.getAgent('2')).resolves.toEqual(agent);
    expect(service.findOne).toHaveBeenCalledWith('2');
  });

  it('creates a agent', async () => {
    const dto: CreateAgentDto = {
      name: 'Agent 3',
      hostname: 'host3',
      os: 'linux',
      agentToken: 'token3',
    };

    await expect(controller.createAgent(dto)).resolves.toBeUndefined();
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('updates a agent', async () => {
    const dto: UpdateAgentDto = {
      name: 'Updated Agent',
      hostname: 'updated-host',
      os: 'linux',
      agentToken: 'token-3',
      status: AgentStatus.ONLINE,
    };

    await expect(controller.updateAgent('3', dto)).resolves.toBeUndefined();
    expect(service.update).toHaveBeenCalledWith('3', dto);
  });

  it('deletes a agent', async () => {
    service.delete.mockResolvedValue(undefined);

    await expect(controller.deleteAgent('4')).resolves.toBeUndefined();
    expect(service.delete).toHaveBeenCalledWith('4');
  });
});
