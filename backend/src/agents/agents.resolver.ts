import { Resolver, Query, Args } from '@nestjs/graphql';
import { AgentsService } from './agents.service';

@Resolver('Agent')
export class AgentsResolver {
  constructor(private readonly agentsService: AgentsService) {}

  @Query('agents')
  agents() {
    return this.agentsService.findAll();
  }

  @Query('agent')
  agent(@Args('id') id: string) {
    return this.agentsService.findOne(id);
  }
}
