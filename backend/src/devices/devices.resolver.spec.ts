jest.mock('src/prisma/prisma.service', () => ({ PrismaService: jest.fn() }), {
  virtual: true,
});
import { Test, TestingModule } from '@nestjs/testing';
import { DevicesResolver } from './devices.resolver';
import { DevicesService } from './devices.service';

describe('DevicesResolver', () => {
  let resolver: DevicesResolver;

  beforeEach(async () => {
    const serviceMock = {
      findAll: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DevicesResolver,
        { provide: DevicesService, useValue: serviceMock },
      ],
    }).compile();

    resolver = module.get<DevicesResolver>(DevicesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
