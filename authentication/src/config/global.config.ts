import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RedisOptions, TcpOptions, Transport } from '@nestjs/microservices';

export interface GlobalConfigInterface {
  database: TypeOrmModuleOptions;
  jwtSecret: string;
  redis: RedisOptions;
  mailerOptions: object,
  usersService: TcpOptions
}

export const globalConfig = (): GlobalConfigInterface => ({
  database: {
    type: 'mysql',
    url: process.env.DATABASE_URL,
    logging: true,
    synchronize: true,
    autoLoadEntities: true,
    dropSchema: true,
  },
  mailerOptions: {
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  },
  jwtSecret: process.env.JWT_SECRET,
  redis: {
    transport: Transport.REDIS,
    options: {
      url: process.env.REDIS_URL,
    },
  },
  usersService: {
    transport: Transport.TCP,
    options: {
      host: process.env.USERS_SV_HOST,
      port: parseInt(process.env.USERS_SV_PORT),
    },
  },
});
