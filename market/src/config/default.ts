import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MicroserviceOptions, TcpOptions, Transport } from '@nestjs/microservices';

interface IDefaultConfig {
  database: TypeOrmModuleOptions,
  authService: MicroserviceOptions & TcpOptions,
}

export const defaultConfig = (): IDefaultConfig => ({
  database: {
    type: 'mysql',
    url: process.env.DATABASE_URL,
    autoLoadEntities: true,
    logging: true,
    synchronize: true,
  },
  authService: {
    transport: Transport.TCP,
    options: {
      host: process.env.AUTH_SV_HOST,
      port: parseInt(process.env.AUTH_SV_PORT)
    }
  }
});