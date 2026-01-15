import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { ApiKeyGuard } from 'src/common/guards/api-key/api-key.guard';

@UseGuards(ApiKeyGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  async create(@Body() createLeadDto: CreateLeadDto) {
    return await this.leadsService.create(createLeadDto);
  }

  @Get()
  async findAll() {
    return await this.leadsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.leadsService.findOne(id);
  }

  @Post(':id/summary')
  async summarize(@Param('id') id: string) {
    return await this.leadsService.generateSummarize(id);
  }

}
