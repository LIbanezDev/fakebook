import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JWTConfig implements JwtOptionsFactory {
  constructor(private configService: ConfigService) {
  }

  createJwtOptions() {
    return {
      signOptions: {
        expiresIn: '24h',
      },
      secret: this.configService.get('jwtSecret'),
    };
  }
}
