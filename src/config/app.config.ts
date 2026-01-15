import { registerAs } from '@nestjs/config'

export default registerAs('appConfig', () => ({
    env: process.env.NODE_ENV || 'Development',
    serviceApiKey: process.env.SERVICE_API_key || 'MasterKey',
    leadsProvider: {
        api: process.env.LEADS_PROVIDER_API || 'https://randomuser.me/api',
        leadsPerRequest: process.env.LEADS_PER_REQUEST || 10
    }
}))