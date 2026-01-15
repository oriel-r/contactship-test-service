import { Module } from '@nestjs/common';
import { LeadsModule } from './modules/leads/leads.module';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import appConfig from './config/app.config';
import { dbConfig } from './database/data-source';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
