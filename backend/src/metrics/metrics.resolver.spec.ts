import { Test, TestingModule } from '@nestjs/testing';
import { MetricsResolver } from './metrics.resolver';
import { MetricsService } from './metrics.service';

describe('MetricsResolver', () => {
  let resolver: MetricsResolver;

  beforeEach(async () => {
    const serviceMock = {
      findAll: jest.fn(),
      findByAgent: jest.fn(),
      findAgent: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricsResolver,
        { provide: MetricsService, useValue: serviceMock },
      ],
    }).compile();

    resolver = module.get<MetricsResolver>(MetricsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
