import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@ArgsType()
export class RegisterArgs {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  name: string;

  @Field({ nullable: true })
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
