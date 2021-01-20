import { Module } from '@nestjs/common';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseConfig } from './config/database.config';
import { defaultConfig } from './config/default';
import { Product } from './entity/product.entity';
import { ClientProxyFactory } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [defaultConfig],
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    TypeOrmModule.forFeature([Product]),
  ],
  controllers: [MarketController],
  providers: [
    MarketService,
    {
      provide: 'USERS_CLIENT',
      useFactory: (configService: ConfigService) => ClientProxyFactory.create(configService.get('usersService')),
      inject: [ConfigService],
    },
  ],
})
export class MarketModule {
}
