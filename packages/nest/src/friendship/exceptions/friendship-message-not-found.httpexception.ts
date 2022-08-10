import { HttpException, HttpStatus } from "@nestjs/common";

export default class FriendshipMessageNotFoundHttpException extends HttpException{
  constructor() {
    super("friendship message not found", HttpStatus.NOT_FOUND);
  }
}