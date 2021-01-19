import { CanActivate, ExecutionContext, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtPayload } from './jwt';

export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_CLIENT')
    private readonly client: ClientProxy,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { req } = GqlExecutionContext.create(context).getContext();
    try {
      if (!req.headers['authorization']?.split(' ')[1]) return false;
      const res = await this.client
        .send<JwtPayload | null>
        ({ role: 'auth', cmd: 'check' }, { jwt: req.headers['authorization']?.split(' ')[1] })
        .toPromise();
      if (!res) return false;
      req.user = res;
      return true;
    } catch (err) {
      Logger.error(err);
      return false;
    }
  }
}
