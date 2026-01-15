import { Injectable, Logger } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadsRepository } from './leads.repository';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name)

  constructor(
    private readonly leadsRepository: LeadsRepository
  ) {}

  create(createLeadDto: CreateLeadDto) {
    return 'This action adds a new lead';
  }

  findAll() {
    return `This action returns all leads`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lead`;
  }

  update(id: number, updateLeadDto: UpdateLeadDto) {
    return `This action updates a #${id} lead`;
  }

  remove(id: number) {
    return `This action removes a #${id} lead`;
  }
}
