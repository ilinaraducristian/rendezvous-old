import { HttpException, HttpStatus } from "@nestjs/common";

export class UserNotInServerHttpException extends HttpException {
  constructor() {
    super("user is not a member of this server", HttpStatus.FORBIDDEN);
  }
}

export class UserAlreadyInServerHttpException extends HttpException {
  constructor() {
    super("user is already a member of this server", HttpStatus.BAD_REQUEST);
  }
}

export class ServerNotFoundHttpException extends HttpException {
  constructor() {
    super("server not found", HttpStatus.NOT_FOUND);
  }
}
