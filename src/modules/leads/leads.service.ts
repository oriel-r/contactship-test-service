import { Injectable, Logger } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadsRepository } from './leads.repository';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name)

  constructor(
    private readonly leadsRepository: any
  ) {}

  async create(createLeadDto: CreateLeadDto) {
    const {email} = createLeadDto
    const registred = await this.hasRegistred(email)
    if(!registred) {
      return 'This action adds a new lead';
    }
    return
  }

  async findAll() {
    return `This action returns all leads`;
  }

  async findOne(id: string) {
    return `This action returns a #${id} lead`;
  }

  async summarize(id: string, updateLeadDto: UpdateLeadDto) {
    return `This action updates a #${id} lead`;
  }

  private async hasRegistred(email: string) {
    const exist = await this.leadsRepository.hasRegistred(email)
    return exist
  }

}
