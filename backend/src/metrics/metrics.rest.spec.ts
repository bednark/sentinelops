import { Test, TestingModule } from '@nestjs/testing';
import { MetricsRestController } from './metrics.rest';

describe('MetricsRestController', () => {
  let controller: MetricsRestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricsRestController],
    }).compile();

    controller = module.get<MetricsRestController>(MetricsRestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
