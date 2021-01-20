import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MicroserviceOptions, TcpOptions, Transport } from '@nestjs/microservices';

interface IDefaultConfig {
  database: TypeOrmModuleOptions,
  usersService: MicroserviceOptions & TcpOptions,
}

export const defaultConfig = (): IDefaultConfig => ({
  database: {
    type: 'mysql',
    url: process.env.DATABASE_URL,
    autoLoadEntities: true,
    logging: true,
    synchronize: true,
  },
  usersService: {
    transport: Transport.TCP,
    options: {
      host: process.env.USERS_SV_HOST,
      port: parseInt(process.env.USERS_SV_PORT),
    },
  },
});