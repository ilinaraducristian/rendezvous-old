import { HttpException, HttpStatus } from "@nestjs/common";

export default class GroupNotFoundHttpException extends HttpException{
  constructor() {
    super('group not found', HttpStatus.NOT_FOUND);
  }
}