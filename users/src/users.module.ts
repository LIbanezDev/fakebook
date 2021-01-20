import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { defaultConfig } from './config/default.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './config/database.config';
import { User } from './entity/user.entity';
import { Image, ImagesTypes } from './entity/image.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [defaultConfig],
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    TypeOrmModule.forFeature([User, Image, ImagesTypes]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
  ],
})
export class UsersModule {
}
