import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './apiGateway.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule, {
    cors: true,
    bodyParser: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  const options = new DocumentBuilder()
    .setTitle('Microservices')
    .setDescription('GraphQL And Rest API Gateway!')
    .setVersion('1.0')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'BearerJWT')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.init();
  const configService = app.get(ConfigService);
  await app.listen(configService.get('port'));
}

bootstrap();
