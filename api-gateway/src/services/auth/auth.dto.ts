import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmail, IsPhoneNumber } from 'class-validator';

export interface AuthUser {
  id: number;
  email: string;
  roles: string[];
}

@ArgsType()
export class RegisterArgs {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  name: string;

  @Field()
  @IsPhoneNumber('CL')
  phoneNumber: string;

  @Field()
  description: string | null;

  @Field()
  password: string;

  @Field()
  bornDate: Date;
}

@ArgsType()
export class LoginArgs {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;
}
