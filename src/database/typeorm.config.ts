import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'node:path';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT as string) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'task_management',
  entities: [__dirname + '/../**/*.typeorm-entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production', // Set to false in production
  logging: process.env.NODE_ENV === 'development',
  migrations: [join(__dirname, '../migrations/*{.ts,.js}')],
};
