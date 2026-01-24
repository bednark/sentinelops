import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { DevicesModule } from './devices/devices.module';
import { MetricsModule } from './metrics/metrics.module';
import { AlertsModule } from './alerts/alerts.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

const isDev = process.env.NODE_ENV !== 'production';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      sortSchema: true,
      playground: isDev,
    }),
    PrismaModule,
    UsersModule,
    DevicesModule,
    MetricsModule,
    AlertsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
