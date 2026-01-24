import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesRestController } from './devices.rest';
import { DevicesResolver } from './devices.resolver';

@Module({
  providers: [DevicesService, DevicesResolver],
  controllers: [DevicesRestController],
})
export class DevicesModule {}
