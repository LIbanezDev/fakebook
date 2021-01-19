import { Module } from '@nestjs/common';
import { DatabaseConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { globalConfig } from './config/global.config';
import { JwtModule } from '@nestjs/jwt';
import { JWTConfig } from './config/jsonwebtoken.config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TerminusModule } from '@nestjs/terminus';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ConfirmationCode } from './entity/confirmationCode.entity';
import { Credential } from './entity/credential.entity';
import { Role } from './entity/role.entity';
import { AuthType } from './entity/authType.entity';
import { createTransport } from 'nodemailer';

@Module({
  imports: [
    TerminusModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [globalConfig],
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    TypeOrmModule.forFeature([Credential, ConfirmationCode, Role, AuthType]),
    PassportModule,
    JwtModule.registerAsync({
      useClass: JWTConfig,
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: 'USER_CLIENT',
      useFactory: (configService: ConfigService) => ClientProxyFactory.create(configService.get('usersService')),
      inject: [ConfigService],
    },
    {
      provide: 'MAILER',
      useFactory: (configService: ConfigService) => createTransport(configService.get('mailerOptions')),
      inject: [ConfigService],
    },
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService) => ClientProxyFactory.create(configService.get('redis')),
      inject: [ConfigService],
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {
}
