import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.REDIS,
    options: {
      url: process.env.REDIS_URI,
    },
  });
  app.listen(() => {
    Logger.log('Comms Service Running');
  });
}

bootstrap();
