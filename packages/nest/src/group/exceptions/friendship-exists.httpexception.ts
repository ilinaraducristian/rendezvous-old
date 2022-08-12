import { HttpException, HttpStatus } from "@nestjs/common";

export default class FriendshipExistsHttpException extends HttpException{
  constructor() {
    super('friendship exists', HttpStatus.BAD_REQUEST);
  }
}