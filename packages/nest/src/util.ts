import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { UserDocument } from './entities/user.schema';

export const ExtractAuthenticatedUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserDocument;
  },
);

export const IgnoreJwt = () => SetMetadata('allowUnauthorizedRequest', true);