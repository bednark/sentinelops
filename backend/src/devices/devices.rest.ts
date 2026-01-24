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
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Controller('devices')
export class DevicesRestController {
  constructor(private readonly devicesService: DevicesService) {}

  @Get()
  getDevices() {
    return this.devicesService.findAll();
  }

  @Get(':id')
  getDevice(@Param('id') id: string) {
    return this.devicesService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  async createDevice(@Body() dto: CreateDeviceDto) {
    await this.devicesService.create(dto);
  }

  @Patch(':id')
  @HttpCode(204)
  async updateDevice(@Param('id') id: string, @Body() dto: UpdateDeviceDto) {
    await this.devicesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteDevice(@Param('id') id: string) {
    return this.devicesService.delete(id);
  }
}
