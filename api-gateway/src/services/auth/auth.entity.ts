import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;
  @Field()
  name: string;
  @Field(() => String)
  bornDate: Date;
  @Field()
  description: string;
  @Field()
  google: boolean;
  @Field()
  github: boolean;
  @Field()
  email: string;
  password: string;
  salt: string;
}

@ArgsType()
export class ConfirmPhoneArgs {
  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  code: number;
}

@ObjectType()
export class LoginResponse {
  @Field(() => User)
  user: User;

  @Field(() => String)
  accessToken: string;
}

@ObjectType()
export class GenericResponse {
  @Field()
  ok: boolean;

  @Field()
  msg: string;

  @Field(() => User, { nullable: true })
  user: User;
}
