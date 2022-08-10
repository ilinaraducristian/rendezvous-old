import { HttpException, HttpStatus } from "@nestjs/common";

export default class FriendshipNotFoundHttpException extends HttpException{
  constructor() {
    super("friendship not found", HttpStatus.NOT_FOUND);
  }
}