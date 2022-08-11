import { MessageEvent as NestMessageEvent } from "@nestjs/common";

interface MessageEvent<T extends object | string = any> extends NestMessageEvent {
  data: T;
}

export default MessageEvent;