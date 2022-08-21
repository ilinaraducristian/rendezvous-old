import { HttpException, HttpStatus } from "@nestjs/common";

export class UserNotFoundHttpException extends HttpException{
  constructor() {
    super('user not found', HttpStatus.NOT_FOUND);
  }
}