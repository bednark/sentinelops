import { Resolver, Query, ResolveField, Parent, Args } from '@nestjs/graphql';
import { MetricsService } from './metrics.service';

@Resolver('Metric')
export class MetricsResolver {
  constructor(private readonly metricsService: MetricsService) {}

  @Query('metrics')
  async metrics(@Args('deviceId') deviceId?: string) {
    if (deviceId) {
      return this.metricsService.findByDevice(deviceId);
    }
    return this.metricsService.findAll();
  }

  @ResolveField('device')
  async device(@Parent() metric: { deviceId: string }) {
    return this.metricsService.findDevice(metric.deviceId);
  }
}
