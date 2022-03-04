import BadRequestException from "./BadRequestExceptions";

class ResourceNotEmptyException extends BadRequestException {
  constructor(resource: string) {
    super(`${resource} must not be empty`);
  }
}

class ChannelNameNotEmptyException extends ResourceNotEmptyException {
  constructor() {
    super("channel name");
  }
}

class GroupNameNotEmptyException extends ResourceNotEmptyException {
  constructor() {
    super("group name");
  }
}

class MessageNotEmptyException extends ResourceNotEmptyException {
  constructor() {
    super("message");
  }
}

class ServerNameNotEmptyException extends ResourceNotEmptyException {
  constructor() {
    super("server name");
  }
}

export default ResourceNotEmptyException;

export { ChannelNameNotEmptyException, GroupNameNotEmptyException, MessageNotEmptyException, ServerNameNotEmptyException };
