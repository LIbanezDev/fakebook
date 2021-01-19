import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../user/user.entity';

@ArgsType()
export class ConfirmPhoneArgs {
  @Field(() => Int)
  credId: number;

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
export class ConfirmCodeResponse {
  @Field()
  ok: boolean;

  @Field()
  msg: string;
}

@ObjectType()
export class RegisterResponse extends ConfirmCodeResponse {
  @Field(() => Int)
  code: number;
}
