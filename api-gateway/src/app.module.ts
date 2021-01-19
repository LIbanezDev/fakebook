import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { globalConfig } from './config/global.config';
import { GraphQLModule } from '@nestjs/graphql';
import { apolloConfig } from './config/apollo-server.config';
import { TerminusModule } from '@nestjs/terminus';
import { AuthResolver } from './services/auth/auth.resolver';
import { ClientProxyFactory } from '@nestjs/microservices';
import { HealthController } from './services/health/health.controller';
import { ChatGateway } from './services/chat/chat.gateway';
import { MarketResolver } from './services/market/market.resolver';
import { UserResolver } from './services/user/user.resolver';
import { Storage } from '@google-cloud/storage';

@Module({
  imports: [
    TerminusModule,
    GraphQLModule.forRoot(apolloConfig),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [globalConfig],
    }),
  ],
  controllers: [HealthController],
  providers: [
    ChatGateway,
    AuthResolver,
    MarketResolver,
    UserResolver,
    {
      provide: 'AUTH_CLIENT',
      useFactory: (configService: ConfigService) => ClientProxyFactory.create(configService.get('authService')),
      inject: [ConfigService],
    },
    {
      provide: 'USERS_CLIENT',
      useFactory: (configService: ConfigService) => ClientProxyFactory.create(configService.get('usersService')),
      inject: [ConfigService],
    },
    {
      provide: 'MARKET_CLIENT',
      useFactory: (configService: ConfigService) => ClientProxyFactory.create(configService.get('marketService')),
      inject: [ConfigService],
    },
    {
      provide: 'GCP_BUCKET',
      useFactory: (configService: ConfigService) => {
        const gcpKeys = configService.get('gcpCredentials');
        const storage = new Storage({
          projectId: gcpKeys.projectId,
          credentials: gcpKeys,
        });
        return storage.bucket('fake_book');
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {
}
