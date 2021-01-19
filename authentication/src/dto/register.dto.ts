import { IsEmail, IsEnum, IsInt, IsString } from 'class-validator';

export enum AUTH_APPS {
  Google,
  GitHub,
}

export class ConfirmCodeDto {
  @IsInt()
  code: number;

  @IsInt()
  credId: number;
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  password: string;

  @IsString()
  bornDate: Date;
}

export class SocialRegisterDto {
  @IsString()
  token!: string;

  @IsEnum(AUTH_APPS)
  type!: AUTH_APPS;
}
