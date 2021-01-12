import { CanActivate, ExecutionContext, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtPayload } from './jwt';

export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_CLIENT')
    private readonly client: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { req } = GqlExecutionContext.create(context).getContext();
    try {
      if (!req.headers['authorization']?.split(' ')[1]) return false;
      const res = await this.client
        .send({ role: 'auth', cmd: 'check' }, { jwt: req.headers['authorization']?.split(' ')[1] })
        .pipe(timeout(5000))
        .toPromise<JwtPayload | null>();
      if (!res) return false;
      req.user = res;
      return true;
    } catch (err) {
      Logger.error(err);
      return false;
    }
  }
}
