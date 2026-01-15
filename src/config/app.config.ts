import { registerAs } from '@nestjs/config'

export default registerAs('appConfig', () => ({
    env: process.env.NODE_ENV || 'Development',
    serviceApiKey: process.env.SERVICE_API_key || 'MasterKey'
}))