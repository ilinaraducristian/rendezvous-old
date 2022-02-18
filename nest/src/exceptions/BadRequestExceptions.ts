import { BadRequestException as BRE } from "@nestjs/common/exceptions/bad-request.exception";

class BadRequestException extends Error {
  toHttpException(): BRE {
    return new BRE(this.message);
  }
}

export class AlreadyMemberException extends BadRequestException {
  constructor() {
    super("you are already a member of this server");
  }
}

export class BadChannelTypeException extends BadRequestException {
  constructor() {
    super("bad channel type");
  }
}

export class BadOrExpiredInvitationException extends BadRequestException {
  constructor() {
    super("invitation is invalid or expired");
  }
}

export class NotAMemberException extends BadRequestException {
  constructor() {
    super("you are not a member of this server");
  }
}

export class AlreadyFriendsException extends BadRequestException {
  constructor() {
    super("you are already friends with this user");
  }
}

export class FriendshipCannotBeUpdatedException extends BadRequestException {
  constructor() {
    super("the friendship cannot be updated");
  }
}

export class FriendshipNotAccessibleException extends BadRequestException {
  constructor() {
    super("the friendship cannot be accessed");
  }
}

export class BadFriendshipStatusException extends BadRequestException {
  constructor() {
    super("invalid status provided");
  }
}

export class DefaultGroupCannotBeDeletedException extends BadRequestException {
  constructor() {
    super("the server's default group cannot be deleted");
  }
}

export default BadRequestException;
