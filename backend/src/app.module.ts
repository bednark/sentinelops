import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { DevicesModule } from './devices/devices.module';
import { MetricsModule } from './metrics/metrics.module';
import { AlertsModule } from './alerts/alerts.module';

@Module({
  imports: [PrismaModule, UsersModule, DevicesModule, MetricsModule, AlertsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
