import { ChannelMessageDto, FriendshipMessageDto, MessageDto } from "@rendezvous/common";
import { makeObservable, observable } from "mobx";
import { fetchAuthApi } from "../api";
import Reaction from "./reaction";

abstract class Message {
  id: string;
  userId: string;
  text: string;
  timestamp: Date;
  files: string[];
  reactions: Map<string, Reaction>;

  constructor(messageDto: MessageDto) {
    this.id = messageDto.id;
    this.userId = messageDto.userId;
    this.text = messageDto.text;
    this.timestamp = messageDto.timestamp;
    this.files = messageDto.files;
    this.reactions = new Map(messageDto.reactions.map((reactionDto) => [reactionDto.id, new Reaction(reactionDto)]));
  }

  abstract apiDelete(): void;

  abstract fromDto(messageDto: any): Message;
}

export class FriendshipMessage extends Message {
  friendshipId: string;

  constructor(messageDto: FriendshipMessageDto) {
    super(messageDto);
    this.friendshipId = messageDto.friendshipId;
    makeObservable(this, {
      id: observable,
      userId: observable,
      text: observable,
      timestamp: observable,
      files: observable,
      reactions: observable,
      friendshipId: observable,
    });
  }

  async apiDelete() {
    await fetchAuthApi(`friendships/${this.friendshipId}/messages/${this.id}`, { method: "DELETE" });
  }

  fromDto(messageDto: any): FriendshipMessage {
    return new FriendshipMessage(messageDto);
  }
}

export class ChannelMessage extends Message {
  serverId: string;
  groupId: string;
  channelId: string;

  constructor(messageDto: ChannelMessageDto) {
    super(messageDto);
    this.serverId = messageDto.serverId;
    this.groupId = messageDto.groupId;
    this.channelId = messageDto.channelId;
    makeObservable(this, {
      id: observable,
      userId: observable,
      text: observable,
      timestamp: observable,
      files: observable,
      reactions: observable,
      serverId: observable,
      groupId: observable,
      channelId: observable,
    });
  }

  async apiDelete() {
    await fetchAuthApi(`servers/${this.serverId}/groups/${this.groupId}/channels/${this.channelId}/messages/${this.id}`, { method: "DELETE" });
  }

  fromDto(messageDto: any): ChannelMessage {
    return new ChannelMessage(messageDto);
  }
}

export interface NoParamConstructor<E> {
  new (messageDto: any): E;
}

export default Message;
