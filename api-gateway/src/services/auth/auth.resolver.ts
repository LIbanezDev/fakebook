import { Args, Mutation, Query, ResolveField, Resolver, Root } from '@nestjs/graphql';
import { ConfirmPhoneArgs, GenericResponse, LoginResponse, User } from './auth.entity';
import { LoginArgs, RegisterArgs } from './auth.dto';
import { Inject, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { timeout } from 'rxjs/operators';
import { ClientProxy } from '@nestjs/microservices';
import { CurrentUserGQL } from './auth.decorators';
import { JwtPayload } from './jwt';

@Resolver(() => User)
export class AuthResolver {
  constructor(@Inject('AUTH_CLIENT') private readonly authClient: ClientProxy) {}

  @ResolveField()
  bornDate(@Root() user: User) {
    return new Date(user.bornDate).toLocaleDateString();
  }

  @UseGuards(AuthGuard)
  @Query(() => User, { description: '[Requires Auth]' })
  checkAuth(@CurrentUserGQL() user: JwtPayload) {
    return this.authClient.send({ role: 'auth', cmd: 'me' }, user.id).pipe(timeout(3000)).toPromise();
  }

  @Mutation(() => GenericResponse)
  async confirmPhone(@Args() data: ConfirmPhoneArgs) {
    const res = await this.authClient.send({ role: 'auth', cmd: 'confirmationCode' }, data).pipe(timeout(3000)).toPromise();
    return {
      ...res,
      user: res.data,
    };
  }

  @Mutation(() => LoginResponse, { nullable: true })
  login(@Args() data: LoginArgs) {
    return this.authClient.send({ role: 'auth', cmd: 'login' }, data).pipe(timeout(3000)).toPromise();
  }

  @Mutation(() => GenericResponse, { nullable: true })
  register(@Args() data: RegisterArgs) {
    return this.authClient
      .send<{ user: User; accessToken: string } | null>({ role: 'auth', cmd: 'register' }, data)
      .pipe(timeout(3000))
      .toPromise();
  }
}
