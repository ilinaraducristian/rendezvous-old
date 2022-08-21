import { HttpException, HttpStatus } from "@nestjs/common";

export class ChannelNotFoundHttpException extends HttpException{
  constructor() {
    super('channel not found', HttpStatus.NOT_FOUND);
  }
}

export class GroupNotFoundHttpException extends HttpException{
  constructor() {
    super('group not found', HttpStatus.NOT_FOUND);
  }
}

export class UserNotMemberOfGroupHttpException extends HttpException{
  constructor() {
    super('user not a member of this group', HttpStatus.FORBIDDEN);
  }
}