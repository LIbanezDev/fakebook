import { Module } from '@nestjs/common';
import { EmailModule } from './modules/email/email.module';
import { ConfigModule } from '@nestjs/config';
import { globalConfig } from './config/global.config';

@Module({
  imports: [
    EmailModule,
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [globalConfig],
    }),
  ],
})
export class AppModule {
}
