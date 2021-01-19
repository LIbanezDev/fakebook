import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientProxy, Transport } from '@nestjs/microservices';
import { timeout } from 'rxjs/operators';
import { DiskHealthIndicator, HealthCheckService, MemoryHealthIndicator, MicroserviceHealthIndicator } from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';

@ApiTags('Microservices health')
@Controller('health')
export class HealthController {
  constructor(
    @Inject('AUTH_CLIENT') private readonly authClient: ClientProxy,
    private readonly healthCheck: HealthCheckService,
    private readonly micro: MicroserviceHealthIndicator,
    private readonly diskHealth: DiskHealthIndicator,
    private readonly memoryHealth: MemoryHealthIndicator,
    private readonly configService: ConfigService,
  ) {
  }

  @Get('api_gateway')
  gatewayHealth() {
    return 'ok';
  }

  @Get('auth')
  authHealth() {
    return this.authClient.send({ role: 'auth', cmd: 'health' }, '').pipe(timeout(3000)).toPromise();
  }

  @Get('chat')
  redis() {
    return this.healthCheck.check([
      () =>
        this.micro.pingCheck('redis', {
          transport: Transport.REDIS,
          options: {
            url: this.configService.get('redisUri'),
          },
        }),
      () => this.memoryHealth.checkHeap('ram memory', 8 * 1024 * 1024 * 1024),
      () =>
        this.diskHealth.checkStorage('hard drive disk', {
          path: 'C:\\',
          threshold: 1024 * 1024 * 1024 * 300, // Storage Limit: 300GB
        }),
    ]);
  }
}
