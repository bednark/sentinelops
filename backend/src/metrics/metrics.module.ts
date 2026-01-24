import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsGrpcController } from './metrics.grpc';
import { MetricsRestController } from './metrics.rest';
import { MetricsResolver } from './metrics.resolver';

@Module({
  providers: [MetricsService, MetricsResolver],
  controllers: [MetricsGrpcController, MetricsRestController],
})
export class MetricsModule {}
