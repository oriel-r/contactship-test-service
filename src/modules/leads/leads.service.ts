import { Injectable, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadsRepository } from './leads.repository';
import { DeepPartial } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { SummaryService } from './services/sumary/summary.service';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name)

  constructor(
    private readonly leadsRepository: LeadsRepository,
    private readonly summryService: SummaryService
  ) {}

  async create(createLeadDto: CreateLeadDto) {
    const {email} = createLeadDto
    const registred = await this.leadsRepository.hasRegistered(email)
    if(registred) throw new UnprocessableEntityException(`The email ${email} has been registred`)
    await this.leadsRepository.create(createLeadDto)
    return await this.findOneByEmail(email)
  }

  async findAll() {
    return await this.leadsRepository.getAll()
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
