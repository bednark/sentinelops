import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  HttpCode,
  Delete,
} from '@nestjs/common';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';

@Controller('agents')
export class AgentsRestController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get()
  getAgents() {
    return this.agentsService.findAll();
  }

  @Get(':id')
  getAgent(@Param('id') id: string) {
    return this.agentsService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  async createAgent(@Body() dto: CreateAgentDto) {
    await this.agentsService.create(dto);
  }

  @Patch(':id')
  @HttpCode(204)
  async updateAgent(@Param('id') id: string, @Body() dto: UpdateAgentDto) {
    await this.agentsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteAgent(@Param('id') id: string) {
    return this.agentsService.delete(id);
  }
}
