import { HttpException, HttpStatus } from "@nestjs/common";

export default class UserLacksPermissionForFriendshipHttpException extends HttpException{
  constructor() {
    super("user doesn't have permission to accept this friendship", HttpStatus.FORBIDDEN);
  }
}