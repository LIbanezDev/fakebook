import * as crypto from 'crypto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { ConfirmCodeDto, RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/auth.interface';
import { ClientProxy } from '@nestjs/microservices';
import { ConfirmationCode } from './entity/confirmation_code.entity';
import { ResponseInterface } from './interfaces/response.interface';


interface IVerifyPassword {
  inputPassword: string;
  encryptedPassword: string;
  salt: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject('REDIS_CLIENT') private clientRedis: ClientProxy,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(ConfirmationCode) private readonly confirmationCodeRepo: Repository<ConfirmationCode>,
    private readonly jwtService: JwtService,
  ) {
  }

  getByIds(ids: number[]) {
    return this.usersRepo.findByIds(ids);
  }

  getById(id: number) {
    return this.usersRepo.findOne(id);
  }

  async confirmCode(data: ConfirmCodeDto): Promise<ResponseInterface<User>> {
    const code = await this.confirmationCodeRepo.findOne({
      where: data,
    });
    if (!code) return { ok: false, msg: 'Codigo incorrecto.' };
    await this.confirmationCodeRepo.remove(code);
    const secondsDifference = Math.round(Math.abs(new Date().getTime() - code.createdAt.getTime()) / 1000);
    if (secondsDifference > 122) return { ok: false, msg: 'Codigo expirado.' };
    await this.usersRepo.update(data.userId, {
      verified: true,
    });
    return {
      ok: true,
      msg: 'Codigo validado correctamente.',
      data: await this.usersRepo.findOne(data.userId),
    };
  }

  async register(data: RegisterDto): Promise<ResponseInterface<number>> {
    const userDB = await this.usersRepo.findOne({
      where: {
        email: data.email,
      },
    });
    if (userDB) return { ok: false, msg: 'Usuario ya registrado' };
    const dbUser = await this.usersRepo.save(this.usersRepo.create({ ...data, verified: true }));
    const confirmationCode = Math.floor(Math.random() * 9999) + 1000;
    await this.confirmationCodeRepo.insert({
      code: confirmationCode,
      userId: dbUser.id,
    });
    await this.clientRedis.emit('CONFIRMATION_CODE', {
      phoneNumber: data.phoneNumber,
      code: confirmationCode,
    });
    return {
      ok: true,
      msg: 'Codigo de confirmacion enviado',
      data: confirmationCode,
    };
  }

  async validateToken(jwt: string) {
    try {
      return this.jwtService.verifyAsync<JwtPayload>(jwt);
    } catch (e: unknown) {
      return null;
    }
  }

  async login({ email, password }: { email: string; password: string }): Promise<{ user: User; accessToken: string } | null> {
    const user = await this.usersRepo.findOne({
      where: {
        email,
        verified: true,
      },
    });
    if (!user) return null;
    const validPassword = this.verifyPassword({ salt: user.salt, encryptedPassword: user.password, inputPassword: password });
    if (!validPassword) return null;
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      roles: ['USER'],
    };
    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }

  public verifyPassword({ inputPassword, encryptedPassword, salt }: IVerifyPassword): boolean {
    const encryptedInputPass = crypto.pbkdf2Sync(inputPassword, salt, 10000, 64, 'sha1').toString('base64');
    return encryptedPassword === encryptedInputPass;
  }
}
