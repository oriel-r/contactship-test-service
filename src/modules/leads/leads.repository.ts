import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Lead } from "./entities/lead.entity";
import { DeepPartial, Repository } from "typeorm";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { UpdateLeadDto } from "./dto/update-lead.dto";

@Injectable()
export class LeadsRepository {
    private readonly logger = new Logger(LeadsRepository.name)

    constructor(
        @InjectRepository(Lead)
        private readonly leadsRepository: Repository<Lead>
    ) {}

    async create(data: CreateLeadDto) {
        return await this.leadsRepository.save(
            this.leadsRepository.create(data)
        )
    }

    async getAll() {
        return await this.leadsRepository.find()
    }

    async getOne(id: string) {
        return await this.leadsRepository.findOneBy({id})
    }

    async getOneByEmail(email: string) {
        return await this.leadsRepository.findOneBy({email})
    }

    async hasRegistered(email: string) {
        return await this.leadsRepository.existsBy({email})
    }

    async save(data: Lead) {
        return await this.leadsRepository.save(data)
    }

    async update(id: string, data) {
        return await this.leadsRepository.update(id, data)
    }

    async batchInsert(data: CreateLeadDto[]) {
        const qb = this.leadsRepository.createQueryBuilder()
                    .insert()
                    .into(Lead)
                    .values(data)
                    .orIgnore()
        
        return await qb.execute()    
    }


}