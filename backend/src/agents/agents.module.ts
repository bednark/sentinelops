import { Module } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { AgentsRestController } from './agents.rest';
import { AgentsResolver } from './agents.resolver';

@Module({
  providers: [AgentsService, AgentsResolver],
  controllers: [AgentsRestController],
})
export class AgentsModule {}
