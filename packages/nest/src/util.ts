import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

export const ExtractAuthenticatedUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const IgnoreJwt = () => SetMetadata('allowUnauthorizedRequest', true);