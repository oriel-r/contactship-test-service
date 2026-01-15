import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadsRepository } from './leads.repository';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name)

  constructor(
    private readonly leadsRepository: LeadsRepository
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

  async summarize(id: string) {
    return `This action updates a #${id} lead`;
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
