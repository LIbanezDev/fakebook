import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RedisOptions, Transport } from '@nestjs/microservices';

export interface GlobalConfigInterface {
  databaseConfig: TypeOrmModuleOptions;
  jwtSecret: string;
  redisConfig: RedisOptions;
}

export const globalConfig = (): GlobalConfigInterface => ({
  databaseConfig: {
    type: 'mysql',
    url: process.env.DATABASE_URL,
    logging: true,
    synchronize: true,
    autoLoadEntities: true,
  },
  jwtSecret: process.env.JWT_SECRET,
  redisConfig: {
    transport: Transport.REDIS,
    options: {
      url: process.env.REDIS_URL,
    },
  },
});
