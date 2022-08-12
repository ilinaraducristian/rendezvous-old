import { HttpException, HttpStatus } from "@nestjs/common";

export default class UserNotFoundHttpException extends HttpException{
  constructor() {
    super('friend user not found', HttpStatus.NOT_FOUND);
  }
}