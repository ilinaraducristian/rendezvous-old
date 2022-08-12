import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { UserDocument } from './entities/user.schema';

export const ExtractAuthenticatedUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().user as UserDocument
);

export const IgnoreJwt = () => SetMetadata('allowUnauthorizedRequest', true);