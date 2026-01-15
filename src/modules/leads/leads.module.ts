import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { SyncService } from './services/sync/sync.service';
import { SummaryService } from './services/sumary/summary.service';
import { LeadsRepository } from './leads.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from './entities/lead.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lead])
  ],
  controllers: [LeadsController],
  providers: [
    LeadsService,
    LeadsRepository,
    SyncService,
    SummaryService
  ],
})
export class LeadsModule {}
