import { HttpException, HttpStatus } from "@nestjs/common";

export class CannotBeFriendWithYourselfHttpException extends HttpException {
  constructor() {
    super("user cannot be friend with himself", HttpStatus.BAD_REQUEST);
  }
}

export class FriendshipNotFoundHttpException extends HttpException {
  constructor() {
    super("friendship not found", HttpStatus.NOT_FOUND);
  }
}

export class UserLacksPermissionForFriendshipHttpException extends HttpException {
  constructor() {
    super("user doesn't have permission to accept this friendship", HttpStatus.FORBIDDEN);
  }
}

export class FriendshipMessageNotFoundHttpException extends HttpException {
  constructor() {
    super("friendship message not found", HttpStatus.NOT_FOUND);
  }
}

export class FriendshipAcceptedHttpException extends HttpException {
  constructor() {
    super("friendship already accepted", HttpStatus.BAD_REQUEST);
  }
}

export class FriendshipExistsHttpException extends HttpException {
  constructor() {
    super("friendship exists", HttpStatus.BAD_REQUEST);
  }
}

export class ReplyMessageDoesntExistHttpException extends HttpException {
  constructor() {
    super("reply message doesn't exist", HttpStatus.BAD_REQUEST);
  }
}
