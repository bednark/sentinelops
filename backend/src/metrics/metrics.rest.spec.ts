import { Test, TestingModule } from '@nestjs/testing';
import { MetricsRestController } from './metrics.rest';
import { MetricsService } from './metrics.service';

describe('MetricsRestController', () => {
  let controller: MetricsRestController;
  let serviceMock: jest.Mocked<Pick<MetricsService, 'findAll' | 'findByDevice'>>;

  beforeEach(async () => {
    serviceMock = {
      findAll: jest.fn(),
      findByDevice: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricsRestController],
      providers: [{ provide: MetricsService, useValue: serviceMock }],
    }).compile();

    controller = module.get<MetricsRestController>(MetricsRestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
