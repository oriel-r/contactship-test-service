import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { AiService } from "../ai/ai.service";
import { LeadsService } from "../leads/leads.service";
import { Logger } from "@nestjs/common";
import { LeadsRepository } from "../leads/leads.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Lead } from "../leads/entities/lead.entity";
import { Repository } from "typeorm";

@Processor('insights', {
    concurrency: 1,
    limiter: {
        max: 1,
        duration: 1000 * 40,
    },
})
export class InsightsWorker extends WorkerHost {
    private readonly logger = new Logger(InsightsWorker.name)
    
    constructor(
        @InjectRepository(Lead)
        private readonly leadRepository: Repository<Lead>,
        private readonly aiService: AiService,
    ) {
        super()
    }
    
    async process(job: Job, token?: string) {
        this.logger.log('Start isight process...')
        const {id} = job.data
        this.logger.debug(id)
        const lead = await this.leadRepository.findOneBy({id})
        this.logger.debug(lead)
        if(!lead) {
            this.logger.error(`Lead with id ${id} not found`)
            throw new Error('Lead not found')
        }
        const leadToUpdate = await this.aiService.processOne(lead)
        this.logger.debug(leadToUpdate)
        await this.leadRepository.save(leadToUpdate)
        this.logger.log(`Lead with id ${id} was updated`)
        return
    }
}