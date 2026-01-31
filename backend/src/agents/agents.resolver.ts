import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { NotFoundException } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';

@Resolver('Agent')
export class AgentsResolver {
  constructor(private readonly agentsService: AgentsService) {}

  @Query('agents')
  agents() {
    return this.agentsService.findAll();
  }

  @Query('agent')
  async agent(@Args('id') id: string) {
    const agent = await this.agentsService.findOne(id);
    if (!agent) {
      throw new NotFoundException(`Agent with id '${id}' not found`);
    }
    return agent;
  }

  @Query('agentsStats')
  agentsStats() {
    return this.agentsService.agentsStats();
  }

  @Mutation('addAgent')
  async addAgent(@Args('input') input: CreateAgentDto) {
    return this.agentsService.create(input);
  }
}
