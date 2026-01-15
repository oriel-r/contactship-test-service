import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { registerAs } from '@nestjs/config';

dotenvConfig({ path: '.env' });

const dataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL, 
  synchronize: false, 
  logging: ['error'],
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/*{.js,.ts}'],
};

export const appDataSource = new DataSource(dataSourceConfig);

export const dbConfig = registerAs('dataSource', () => dataSourceConfig);

