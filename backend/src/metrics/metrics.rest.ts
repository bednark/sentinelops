import {
  Controller,
  Get,
  Param
} from '@nestjs/common';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsRestController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  getMetrics() {
    return this.metricsService.findAll();
  }

  @Get(':deviceId')
  getMetricsByDevice(@Param('deviceId') deviceId: string) {
    return this.metricsService.findByDevice(deviceId);
  }
}
