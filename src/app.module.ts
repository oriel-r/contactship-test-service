import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LeadsModule } from './modules/leads/leads.module';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import appConfig from './config/app.config';
import { dbConfig } from './database/data-source';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { RequestLoggerMiddleware } from './common/middlewares/logger/logger.middleware';
import { HttpModule } from '@nestjs/axios'
import { ScheduleModule } from '@nestjs/schedule';

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
    LeadsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware)
  }
}
