import { Resolver, Query, ResolveField, Parent, Args } from '@nestjs/graphql';
import { MetricsService } from './metrics.service';
import { MetricName } from 'generated/prisma/enums';

@Resolver('Metric')
export class MetricsResolver {
  constructor(private readonly metricsService: MetricsService) {}

  @Query('metrics')
  async metrics(@Args('metricName') metricName: MetricName, @Args('agentId') agentId?: string) {
    if (agentId) {
      return this.metricsService.findByAgent(metricName, agentId);
    }
    return this.metricsService.findAll(metricName);
  }

  @ResolveField('agent')
  async agent(@Parent() metric: { agentId: string }) {
    return this.metricsService.findAgent(metric.agentId);
  }
}
