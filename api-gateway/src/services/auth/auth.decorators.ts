import { GqlExecutionContext } from '@nestjs/graphql';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserGQL = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const { req } = GqlExecutionContext.create(context).getContext();
  return req.user;
});
