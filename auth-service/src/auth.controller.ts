import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { ConfirmCodeDto, RegisterDto } from './dto/register.dto';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { JwtPayload } from './interfaces/auth.interface';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly health: HealthCheckService,
    private readonly database: TypeOrmHealthIndicator,
  ) {}

  @MessagePattern({ role: 'auth', cmd: 'health' })
  async healthChecker() {
    const res = await this.health.check([
      () =>
        this.database.pingCheck('database', {
          timeout: 300,
        }),
    ]);
    Logger.log(res);
    return res;
  }

  @MessagePattern({ role: 'auth', cmd: 'confirmationCode' })
  confirmationCode(data: ConfirmCodeDto) {
    return this.authService.confirmCode(data);
  }

  @MessagePattern({ role: 'auth', cmd: 'googleRegister' })
  googleRegister(data: ConfirmCodeDto) {
    return this.authService.confirmCode(data);
  }

  @MessagePattern({ role: 'auth', cmd: 'me' })
  me(id: number) {
    return this.authService.getById(id);
  }

  @MessagePattern({ role: 'auth', cmd: 'register' })
  register(data: RegisterDto) {
    return this.authService.register(data);
  }

  @MessagePattern({ role: 'auth', cmd: 'check' })
  loggedIn(data: { jwt: string }): Promise<JwtPayload | null> {
    return this.authService.validateToken(data.jwt);
  }

  @MessagePattern({ role: 'auth', cmd: 'login' })
  login(data: RegisterDto) {
    return this.authService.login(data);
  }

  @MessagePattern({ role: 'auth', cmd: 'userById' })
  getOne(userId: number) {
    return this.authService.getById(userId);
  }

  @MessagePattern({ role: 'auth', cmd: 'usersById' })
  getMany(usersId: number[]) {
    return this.authService.getByIds(usersId);
  }
}
