import { NotFoundException } from "@nestjs/common";

class ResourceNotFoundException extends Error {
  toHttpException(): NotFoundException {
    return new NotFoundException(`${this.message} not found`);
  }
}

class ChannelNotFoundException extends ResourceNotFoundException {
  constructor() {
    super("channel");
  }
}

class GroupNotFoundException extends ResourceNotFoundException {
  constructor(groupId?: string) {
    if (groupId === undefined) super("group");
    else super(`group with id: ${groupId}`);
  }
}

class MessageNotFoundException extends ResourceNotFoundException {
  constructor() {
    super("message");
  }
}

class ServerNotFoundException extends ResourceNotFoundException {
  constructor() {
    super("server");
  }
}

class FriendshipNotFoundException extends ResourceNotFoundException {
  constructor() {
    super("friendship");
  }
}

class EmojiNotFoundException extends ResourceNotFoundException {
  constructor() {
    super("emoji");
  }
}

class ReactionNotFoundException extends ResourceNotFoundException {
  constructor() {
    super("reaction");
  }
}

export default ResourceNotFoundException;

export {
    ChannelNotFoundException,
    GroupNotFoundException,
    MessageNotFoundException,
    ServerNotFoundException,
    FriendshipNotFoundException,
    EmojiNotFoundException,
    ReactionNotFoundException,
};

