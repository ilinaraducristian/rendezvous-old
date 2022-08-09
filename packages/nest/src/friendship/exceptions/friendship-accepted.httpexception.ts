import { HttpException, HttpStatus } from "@nestjs/common";

export default class FriendshipAcceptedHttpException extends HttpException{
  constructor() {
    super('friendship already accepted', HttpStatus.BAD_REQUEST);
  }
}