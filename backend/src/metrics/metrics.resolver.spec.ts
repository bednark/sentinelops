import { Test, TestingModule } from '@nestjs/testing';
import { MetricsResolver } from './metrics.resolver';

describe('MetricsResolver', () => {
  let controller: MetricsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricsResolver],
    }).compile();

    controller = module.get<MetricsResolver>(MetricsResolver);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
