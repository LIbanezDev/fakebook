import * as crypto from 'crypto';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Credential } from './entity/credential.entity';
import { Repository } from 'typeorm';
import { ConfirmCodeDto, RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/auth.interface';
import { ConfirmationCode } from './entity/confirmationCode.entity';
import { ResponseInterface } from './interfaces/response.interface';
import { Transporter } from 'nodemailer';
import { Role } from './entity/role.entity';
import { ClientProxy } from '@nestjs/microservices';
import { IUser } from './interfaces/entity.interface';

interface IVerifyPassword {
  inputPassword: string;
  encryptedPassword: string;
  salt: string;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject('MAILER') private readonly mailer: Transporter,
    @Inject('USER_CLIENT') private readonly usersClient: ClientProxy,
    @InjectRepository(Credential) private readonly usersCredsRepo: Repository<Credential>,
    @InjectRepository(ConfirmationCode) private readonly confirmationCodeRepo: Repository<ConfirmationCode>,
    @InjectRepository(Role) private readonly rolesRepo: Repository<Role>,
    private readonly jwtService: JwtService,
  ) {
    this.rolesRepo.findOne({ name: 'ADMIN' })
      .then(res => {
        if (!res) {
          this.rolesRepo.insert([
            { name: 'ADMIN' },
            { name: 'USER' },
            { name: 'OWNER' },
          ]);
        }
      });
  }

  async confirmCode(data: ConfirmCodeDto): Promise<ResponseInterface<Boolean>> {
    const code = await this.confirmationCodeRepo.findOne({
      where: {
        code: data.code,
        credential: {
          id: data.credId,
        },
      },
      relations: ['credential'],
    });
    if (!code) return { ok: false, msg: 'Codigo incorrecto.' };
    await this.confirmationCodeRepo.remove(code);
    const secondsDifference = Math.round((new Date().getTime() - code.createdAt.getTime()) / 1000);
    Logger.log(secondsDifference);
    if (secondsDifference > 122) return { ok: false, msg: 'Codigo expirado.' };
    await this.usersCredsRepo.update(data.credId, { verified: true });
    return {
      ok: true,
      msg: 'Codigo validado correctamente.',
    };
  }

  async register(data: RegisterDto): Promise<ResponseInterface<number>> {
    const creds = await this.usersCredsRepo.findOne({
      where: {
        email: data.email,
      },
    });
    if (creds) return { ok: false, msg: 'Usuario ya registrado' };
    const newCred = this.usersCredsRepo.create(data);
    const randomNumber = Math.floor(Math.random() * 9999) + 1001;
    this.mailer.sendMail({
      from: 'lucas.ibanez18@outlook.com',
      to: newCred.email,
      subject: 'Confirmación de cuenta Fakebook',
      text: 'Codigo de confirmación',
      html: `<h2> Codigo de confirmacion: <strong> ${randomNumber} </strong> </h2>`,
    });
    newCred.roles = [await this.rolesRepo.findOne({ where: { name: 'USER' } })];
    await this.usersCredsRepo.save(newCred);
    const confirmationCode = new ConfirmationCode();
    confirmationCode.code = randomNumber;
    confirmationCode.credential = newCred;
    await this.confirmationCodeRepo.save(confirmationCode);
    await this.usersClient.send({ role: 'user', cmd: 'registerUser' }, {
      name: data.name,
      description: data.description,
      bornDate: data.bornDate,
      credentialId: newCred.id,
    }).toPromise();
    return {
      ok: true,
      msg: 'Codigo de confirmacion enviado',
      data: randomNumber,
    };
  }

  async validateToken(jwt: string) {
    try {
      return this.jwtService.verifyAsync<JwtPayload>(jwt);
    } catch (e: unknown) {
      return null;
    }
  }

  async login({ email, password }: { email: string; password: string }): Promise<{ user: IUser, accessToken: string } | null> {
    const creds = await this.usersCredsRepo.findOne({
      where: {
        email,
        verified: true,
      },
      relations: ['roles'],
    });
    if (!creds) return null;
    const validPassword = this.verifyPassword({ salt: creds.salt, encryptedPassword: creds.password, inputPassword: password });
    if (!validPassword) return null;
    const payload: JwtPayload = {
      id: creds.id,
      email: creds.email,
      roles: creds.roles.map(r => r.name),
    };
    return {
      user: await this.usersClient.send({ role: 'user', cmd: 'getByCredentialId' }, creds.id).toPromise(),
      accessToken: this.jwtService.sign(payload),
    };
  }

  public verifyPassword({ inputPassword, encryptedPassword, salt }: IVerifyPassword): boolean {
    const encryptedInputPass = crypto.pbkdf2Sync(inputPassword, salt, 10000, 64, 'sha1').toString('base64');
    return encryptedPassword === encryptedInputPass;
  }
}
