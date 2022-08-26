import { createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common";
import { Friendship } from "./entities/friendship.schema";
import { UserDocument } from "./entities/user.schema";

export const ExtractAuthenticatedUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().user as UserDocument
);

export function IgnoreJwt() {
  return SetMetadata("allowUnauthorizedRequest", true);
}

export function extractOtherId(user: UserDocument, friendship: Friendship) {
  return user.id === friendship.user1.toString() ? friendship.user2 : friendship.user1;
}
