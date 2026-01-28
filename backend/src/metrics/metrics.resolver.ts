import { Resolver, Query, ResolveField, Parent, Args } from '@nestjs/graphql';
import { MetricsService } from './metrics.service';

@Resolver('Metric')
export class MetricsResolver {
  constructor(private readonly metricsService: MetricsService) {}

  @Query('metrics')
  async metrics(@Args('agentId') agentId?: string) {
    if (agentId) {
      return this.metricsService.findByAgent(agentId);
    }
    return this.metricsService.findAll();
  }

  @ResolveField('agent')
  async agent(@Parent() metric: { agentId: string }) {
    return this.metricsService.findAgent(metric.agentId);
  }
}
