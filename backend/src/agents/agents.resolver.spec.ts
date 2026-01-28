jest.mock('src/prisma/prisma.service', () => ({ PrismaService: jest.fn() }), {
  virtual: true,
});
import { Test, TestingModule } from '@nestjs/testing';
import { AgentsResolver } from './agents.resolver';
import { AgentsService } from './agents.service';

describe('AgentsResolver', () => {
  let resolver: AgentsResolver;

  beforeEach(async () => {
    const serviceMock = {
      findAll: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgentsResolver,
        { provide: AgentsService, useValue: serviceMock },
      ],
    }).compile();

    resolver = module.get<AgentsResolver>(AgentsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
