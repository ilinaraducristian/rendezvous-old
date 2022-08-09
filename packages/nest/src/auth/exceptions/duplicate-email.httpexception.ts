import { HttpException, HttpStatus } from "@nestjs/common";

export default class DuplicateEmailHttpException extends HttpException{
  constructor() {
    super('user with this email address already exists', HttpStatus.BAD_REQUEST);
  }
}