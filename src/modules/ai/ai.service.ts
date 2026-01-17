import { GoogleGenAI } from '@google/genai';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import appConfig from 'src/config/app.config';
import * as fs from 'fs';
import * as path from 'path';
import { Lead } from '../leads/entities/lead.entity';

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);
    private readonly aiClient: GoogleGenAI;
    private readonly promptPath = path.join(
        process.cwd(),
        'src',
        'modules',
        'ai',
        'prompts',
        'vpn_analysis.md'
    );

    constructor(
        @Inject(appConfig.KEY)
        private readonly config: ConfigType<typeof appConfig>
    ) {
        const apiKey = config.genAi.apiKey;

        if (!apiKey) throw new Error('GenAi API Key undefined');

        this.aiClient = new GoogleGenAI({ apiKey });
    }

    async processBatch(leads: Lead[]): Promise<Lead[]> {
        const results = await Promise.allSettled(
            leads.map((lead) => this.processOne(lead))
        );

        return results
            .filter((r): r is PromiseFulfilledResult<Lead> => r.status === 'fulfilled')
            .map((r) => r.value);
    }

    async processOne(lead: Lead): Promise<Lead> {
        const { summary, nextAction } = await this.generateSummarize(lead);

        if(!summary || !nextAction) {
            this.logger.error('Error to generatesummary andnext action')
            throw new Error()
        }

        return {
            ...lead,
            summary: summary,
            nextAction: nextAction,
        };
    }

    private async generateSummarize(lead: Lead): Promise<LeadAnalysis> {
        const response = await this.aiClient.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: 'Generate a new analysis',
            config: {
                systemInstruction: this.generateLeadTemplate(lead),
                temperature: 0.6,
            },
        });


        return JSON.parse(response.text!);
    }

    private generateLeadTemplate(lead: Lead): string {
        let template = fs.readFileSync(this.promptPath, 'utf-8');

        const data: Record<string, string | number> = {
            '{{firstName}}': lead.firstName,
            '{{lastName}}': lead.lastName,
            '{{city}}': lead.city,
            '{{country}}': lead.country,
            '{{email}}': lead.email,
            '{{phone}}': lead.phone || 'N/A',
            '{{age}}': lead.age || 'Unknown',
        };

        Object.keys(data).forEach((key) => {
            template = template.replace(new RegExp(key, 'g'), String(data[key]));
        });


        return template;
    }
}
