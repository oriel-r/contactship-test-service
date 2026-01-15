import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Lead } from "./entities/lead.entity";
import { DeepPartial, Repository } from "typeorm";
import { CreateLeadDto } from "./dto/create-lead.dto";

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

    async getOne(id: string) {
        return await this.leadsRepository.findOneBy({id})
    }

    async hasRegistered(email: string) {
        const exist = await this.leadsRepository.existsBy({email})
        return !!exist
    }

    async save(data: Lead | DeepPartial<Lead>) {
        return await this.leadsRepository.save(data)
    }


}