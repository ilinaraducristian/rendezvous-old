import { HttpException, HttpStatus } from "@nestjs/common";

export default class ChannelNotFoundHttpException extends HttpException{
  constructor() {
    super('channel not found', HttpStatus.NOT_FOUND);
  }
}