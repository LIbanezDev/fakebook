import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, TcpOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { MarketModule } from './market.module';

const microserviceOptions: MicroserviceOptions & TcpOptions = {
  transport: Transport.TCP,
  options: {
    host: process.env.HOST || 'localhost',
    port: parseInt(process.env.PORT) || 5555,
  },
};

async function bootstrap() {
  const app = await NestFactory.createMicroservice(MarketModule, microserviceOptions);
  app.listen(() => {
    Logger.log('Market running');
  });
}

bootstrap();
