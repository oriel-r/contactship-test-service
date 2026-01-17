import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LeadsModule } from './modules/leads/leads.module';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import appConfig from './config/app.config';
import { dbConfig } from './database/data-source';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { RequestLoggerMiddleware } from './common/middlewares/logger/logger.middleware';
import { HttpModule } from '@nestjs/axios'
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis, { createKeyv, Keyv } from '@keyv/redis';
import { BullModule } from '@nestjs/bullmq';
import { InsightsModule } from './modules/insights/insights.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [appConfig, dbConfig]
    }),
    TypeOrmModule.forRootAsync({
      inject: [dbConfig.KEY],
      useFactory: (config: ConfigType<typeof dbConfig>) => config
    }),
    HttpModule.registerAsync({
      global: true,
      inject: [appConfig.KEY],
      useFactory: (config: ConfigType<typeof appConfig>) => ({
        baseURL: config.leadsProvider.api
      }),
    }),
    ScheduleModule.forRoot(),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [appConfig.KEY],
      useFactory: async (config:ConfigType<typeof appConfig>) => ({
        stores: [
          createKeyv(`redis://${config.redis.host}:${config.redis.port}`)
          ]
      })
    }),
    BullModule.forRootAsync({
      inject: [appConfig.KEY],
      useFactory: async (config: ConfigType<typeof appConfig>) => ({
        connection: {
          host: config.redis.host,
          port: config.redis.port
        }
      })
    }),
    LeadsModule,
    InsightsModule,
    AiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware)
  }
}
