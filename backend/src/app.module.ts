import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { DevicesModule } from './devices/devices.module';
import { MetricsController } from './metrics/metrics.controller';
import { MetricsService } from './metrics/metrics.service';
import { MetricsModule } from './metrics/metrics.module';
import { AlertsModule } from './alerts/alerts.module';

@Module({
  imports: [PrismaModule, UsersModule, DevicesModule, MetricsModule, AlertsModule],
  controllers: [MetricsController],
  providers: [MetricsService],
})
export class AppModule {}
