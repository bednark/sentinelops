import { Test, TestingModule } from '@nestjs/testing';
import { MetricsGrpcController } from './metrics.grpc';
import { MetricsService } from './metrics.service';
import { from, firstValueFrom } from 'rxjs';
import { CreateMetricDto, MetricName } from './dto/create-metric.dto';

describe('MetricsGrpcController', () => {
  let controller: MetricsGrpcController;
  let serviceMock: { create: jest.Mock };

  beforeEach(async () => {
    serviceMock = { create: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricsGrpcController],
      providers: [{ provide: MetricsService, useValue: serviceMock }],
    }).compile();

    controller = module.get<MetricsGrpcController>(MetricsGrpcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calls service.create for streamed metrics', async () => {
    const chunk: CreateMetricDto[] = [
      {
        agentId: 'd',
        name: MetricName.CPU_USAGE,
        value: 1,
        timestamp: { seconds: 1 },
      },
      {
        agentId: 'd',
        name: MetricName.RAM_USAGE,
        value: 2,
        timestamp: { seconds: 2 },
      },
    ];
    serviceMock.create.mockResolvedValue(chunk.length);

    const result$ = controller.streamMetrics(from(chunk));
    const result = await firstValueFrom(result$);

    expect(result).toEqual({ success: true, receivedCount: chunk.length });
    expect(serviceMock.create).toHaveBeenCalledWith(chunk);
  });
});
