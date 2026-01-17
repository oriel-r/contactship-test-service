import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import appConfig from 'src/config/app.config';
import { ConfigType } from '@nestjs/config';
import { LeadsService } from './leads.service';
import { ExternalLead } from 'src/modules/leads/interfaces/leads-provider-api-response.interface';
import { CreateLeadDto } from './dto/create-lead.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class SyncCron {
    private readonly logger = new Logger(SyncCron.name)
    
    constructor(
        @Inject(appConfig.KEY)
        private readonly config: ConfigType<typeof appConfig>,
        private readonly leadsProviderHttpClient: HttpService,
        private readonly leadsService: LeadsService
    ) {}
    
    @Cron(CronExpression.EVERY_5_MINUTES)
    async syncLeadsFromProvider (){
        this.logger.warn('Start leads sincronization...')
        const externalLeads = await this.getLeadsArray()
        const mapedNewLeads = this.mapLeads(externalLeads)
        await this.leadsService.batchCreate(mapedNewLeads)
        this.logger.warn('End leads sincronization')
    }

    private async getLeadsArray(): Promise<ExternalLead[]> {
        
        const {data: {results}} = await firstValueFrom(
            this.leadsProviderHttpClient.get('', {
                params: {
                    results: this.config.leadsProvider.leadsPerRequest
                }
            })
        )
        
        if(!results.length) {
            this.logger.warn('Leads not provider by external api')
            throw new Error('Sync process stoped')
        }

        return results
    }

    private mapLeads(externalLeads: ExternalLead[]): CreateLeadDto[] {
        this.logger.log('Formating from external provider...')
        return externalLeads.map((unformatedLead): CreateLeadDto => ({
            firstName: unformatedLead.name.first,
            lastName: unformatedLead.name.last,
            age: unformatedLead.dob.age,
            email:  unformatedLead.email,
            phone: unformatedLead.phone,
            city: unformatedLead.location.city,
            country: unformatedLead.location.country
        })
    )}
}
