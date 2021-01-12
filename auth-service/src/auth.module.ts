import { Module } from '@nestjs/common';
import { DatabaseConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { globalConfig } from './config/global.config';
import { User } from './entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JWTConfig } from './config/jsonwebtoken.config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TerminusModule } from '@nestjs/terminus';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ConfirmationCode } from './entity/confirmation_code.entity';

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
    TypeOrmModule.forFeature([User, ConfirmationCode]),
    PassportModule,
    JwtModule.registerAsync({
      useClass: JWTConfig,
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService) => ClientProxyFactory.create(configService.get('redisConfig')),
      inject: [ConfigService],
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
