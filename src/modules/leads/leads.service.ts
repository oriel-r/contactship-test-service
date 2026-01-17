import { Inject, Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadsRepository } from './leads.repository';
import { DeepPartial } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import appConfig from 'src/config/app.config';
import { ConfigType } from '@nestjs/config';
import { AiService } from '../ai/ai.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { timeout } from 'rxjs';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name) 
  private readonly ttl: any

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @Inject(appConfig.KEY)
    private readonly config: ConfigType<typeof appConfig>,
    @InjectQueue('insights')
    private readonly queue: Queue,
    private readonly leadsRepository: LeadsRepository,
    private readonly summryService: AiService,
  ) {}

  async create(createLeadDto: CreateLeadDto) {
    const {email} = createLeadDto
    const registred = await this.leadsRepository.hasRegistered(email)
    if(registred) throw new UnprocessableEntityException(`The email ${email} has been registred`)
    await this.leadsRepository.create(createLeadDto)
    return await this.findOneByEmail(email)
  }

  async findAll() {
    const key = 'all-leads'
    let leads = await this.cacheManager.get(key)
    if(!leads) {
      this.logger.debug('Getting users from db...')
      leads = await this.leadsRepository.getAll()
      this.logger.debug('Setting cache...')
      await this.cacheManager.set(key, leads, this.config.redis.cacheTtl)
      this.logger.debug('Returnning leads')
      return leads
    }
    this.logger.debug('Return leads from cache')
    return leads
  }

  async findOne(id: string) {
    return await this.leadsRepository.getOne(id);
  }

  async findOneByEmail(email: string) {
      return await this.leadsRepository.getOneByEmail(email)
  }

  async update(id: string, data: DeepPartial<Lead>) {
    return await this.leadsRepository.update(id, data)
  }

  async generateSummarize(id: string) {
    const lead = await this.leadsRepository.getOne(id)
    if(!lead) throw new NotFoundException('Lead no encontrado')
    const response = await this.summryService.processOne(lead)
    return await this.leadsRepository.save(response)
  }

  async batchCreate(data: CreateLeadDto[]) {
    this.logger.log('Saving leads in DB...')
    try{
      const result = await this.leadsRepository.batchInsert(data)
      this.logger.log({
        status: 'Success',
        detail: {
          newLeads: result.identifiers.length,
          skipedLeads: data.length - result.identifiers.length
        }
      })

      const jobs = result.identifiers.map((leadId) => ({ 
        name: 'analize-lead', 
        data: leadId,
        opts: {
          attempts: 3, 
          backoff: 1000 * 30 
        },
        timeout: 1000 * 30
      }));

      await this.queue.addBulk(jobs)
      this.logger.debug(result.identifiers)
      return result
    } catch(err) {
       this.logger.error({
        status: 'Error',
        raw: err
      })    
      return
    }
  }

}
