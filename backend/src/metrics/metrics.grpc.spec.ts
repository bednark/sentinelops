import { Test, TestingModule } from '@nestjs/testing';
import { MetricsGrpcController } from './metrics.grpc';

describe('MetricsGrpcController', () => {
  let controller: MetricsGrpcController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricsGrpcController],
    }).compile();

    controller = module.get<MetricsGrpcController>(MetricsGrpcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
