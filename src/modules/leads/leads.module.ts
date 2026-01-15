import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { SyncService } from './services/sync/sync.service';
import { SumaryService } from './services/sumary/sumary.service';
import { LeadsRepository } from './leads.repository';

@Module({
  controllers: [LeadsController],
  providers: [
    LeadsService,
    LeadsRepository,
    SyncService,
    SumaryService
  ],
})
export class LeadsModule {}
