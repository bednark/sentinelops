import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  HttpCode,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import {
  UpdateAgentNameDto,
  UpdateAgentStatusDto,
} from './dto/update-agent.dto';

@Controller('agents')
export class AgentsRestController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get()
  getAgents() {
    return this.agentsService.findAll();
  }

  @Get(':id')
  async getAgent(@Param('id') id: string) {
    const agent = await this.agentsService.findOne(id);
    if (!agent) {
      throw new NotFoundException(`Agent with id '${id}' not found`);
    }
    return agent;
  }

  @Post()
  @HttpCode(201)
  async createAgent(@Body() dto: CreateAgentDto) {
    return this.agentsService.create(dto);
  }

  @Patch(':id/update-name')
  @HttpCode(204)
  async updateAgentName(
    @Param('id') id: string,
    @Body() dto: UpdateAgentNameDto,
  ) {
    await this.agentsService.updateName(id, dto);
  }

  @Patch(':id/update-status')
  @HttpCode(204)
  async updateAgentStatus(
    @Param('id') id: string,
    @Body() dto: UpdateAgentStatusDto,
  ) {
    await this.agentsService.updateStatus(id, dto);
  }

  @Patch(':id/update-token')
  @HttpCode(200)
  async updateAgentToken(@Param('id') id: string) {
    return this.agentsService.updateToken(id);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteAgent(@Param('id') id: string) {
    await this.agentsService.delete(id);
  }
}
