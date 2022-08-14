import { HttpException, HttpStatus } from "@nestjs/common";

export default class UserNotMemberOfGroupHttpException extends HttpException{
  constructor() {
    super('user not a member of this group', HttpStatus.FORBIDDEN);
  }
}