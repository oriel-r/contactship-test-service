import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { LeadsRepository } from './leads.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from './entities/lead.entity';
import { BullModule } from '@nestjs/bullmq';
import appConfig from 'src/config/app.config';
import { ConfigType } from '@nestjs/config';
import { InsightsModule } from '../insights/insights.module';
import { AiModule } from '../ai/ai.module';
import { SyncCron } from './sync.cron';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lead]),
    InsightsModule,
    AiModule
  ],
  controllers: [LeadsController],
  providers: [
    LeadsService,
    LeadsRepository,
    SyncCron,
  ],
  exports: [LeadsService, LeadsRepository]
})
export class LeadsModule {}
