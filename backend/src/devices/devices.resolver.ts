import { Resolver, Query, Args } from '@nestjs/graphql';
import { DevicesService } from './devices.service';

@Resolver('Device')
export class DevicesResolver {
  constructor(private readonly devicesService: DevicesService) {}

  @Query('devices')
  devices() {
    return this.devicesService.findAll();
  }

  @Query('device')
  device(@Args('id') id: string) {
    return this.devicesService.findOne(id);
  }
}
