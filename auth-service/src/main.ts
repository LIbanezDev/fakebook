import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AuthModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.HOST || 'localhost',
      port: process.env.PORT || '4444',
    },
  });
  app.listen(() => {
    Logger.log('Auth Service Running');
  });
}

bootstrap();
