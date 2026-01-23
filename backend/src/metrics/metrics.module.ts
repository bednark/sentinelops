import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsGrpcController } from './metrics.grpc';
import { MetricsRestController } from './metrics.rest';

@Module({
  providers: [MetricsService],
  controllers: [MetricsGrpcController, MetricsRestController],
})
export class MetricsModule {}
