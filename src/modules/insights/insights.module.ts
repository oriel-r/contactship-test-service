import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { InsightsWorker } from './insights.worker';
import { AiModule } from '../ai/ai.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from '../leads/entities/lead.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Lead]),
        BullModule.registerQueue({
            name: 'insights'
        }),
        AiModule,
    ],
    providers: [
      InsightsWorker
    ],
    exports: [BullModule]
})
export class InsightsModule {}
