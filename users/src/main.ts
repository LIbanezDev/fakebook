import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { UsersModule } from './users.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(UsersModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.HOST || 'localhost',
      port: process.env.PORT || '6666',
    },
  });
  app.listen(() => {
    Logger.log('Users Service Running');
  });
}

bootstrap();
