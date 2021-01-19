import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ConfirmCodeResponse, ConfirmPhoneArgs, LoginResponse, RegisterResponse } from './auth.entity';
import { LoginArgs, RegisterArgs } from './auth.dto';
import { Inject, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { ClientProxy } from '@nestjs/microservices';
import { CurrentUserGQL } from './auth.decorators';
import { JwtPayload } from './jwt';
import { User } from '../user/user.entity';

@Resolver(() => User)
export class AuthResolver {
  constructor(
    @Inject('USERS_CLIENT') private readonly usersClient: ClientProxy,
    @Inject('AUTH_CLIENT') private readonly authClient: ClientProxy,
  ) {
  }

  @UseGuards(AuthGuard)
  @Query(() => User, { description: '[Requires Auth]' })
  checkAuth(@CurrentUserGQL() user: JwtPayload) {
    return this.usersClient.send({ role: 'user', cmd: 'getById' }, user.id).toPromise();
  }

  @Mutation(() => ConfirmCodeResponse)
  confirmEmail(@Args() data: ConfirmPhoneArgs): Promise<ConfirmCodeResponse> {
    return this.authClient.send<ConfirmCodeResponse>({ role: 'auth', cmd: 'confirmationCode' }, data).toPromise();
  }

  @Mutation(() => LoginResponse, { nullable: true })
  login(@Args() data: LoginArgs) {
    return this.authClient.send({ role: 'auth', cmd: 'login' }, data).toPromise();
  }

  @Mutation(() => RegisterResponse, { nullable: true })
  register(@Args() data: RegisterArgs): Promise<RegisterResponse> {
    return this.authClient
      .send<RegisterResponse>({ role: 'auth', cmd: 'register' }, data)
      .toPromise();
  }
}
