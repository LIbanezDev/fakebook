import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface IDefaultConfig {
  database: TypeOrmModuleOptions;
}

export const defaultConfig = (): IDefaultConfig => ({
  database: {
    type: 'mysql',
    url: process.env.DATABASE_URL,
    logging: true,
    autoLoadEntities: true,
    synchronize: true,
  },
});