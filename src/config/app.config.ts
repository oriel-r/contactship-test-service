import { registerAs } from '@nestjs/config'

export default registerAs('appConfig', () => ({
    env: process.env.NODE_ENV || 'Development',
    serviceApiKey: process.env.SERVICE_API_key || 'MasterKey',
    leadsProvider: {
        api: process.env.LEADS_PROVIDER_API || 'https://randomuser.me/api',
        leadsPerRequest: process.env.LEADS_PER_REQUEST || 3
    },
    genAi: {
        apiKey: process.env.GEMINI_API_KEY
    },
    redis: {
        cacheTtl: process.env.CACHE_TTL as unknown as number || 1000 * 30,
        host: process.env.REDIS_HOST ||'localhost',
        port: process.env.REDIS_PORT as unknown as number || 6379 
    }
}))