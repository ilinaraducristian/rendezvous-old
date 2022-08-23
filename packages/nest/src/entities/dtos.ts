import { FriendshipMessageDocument } from "./friendship-message.schema";
import { GroupMessageDocument } from "./group-message.schema";
import { Channel } from "./channel.schema";
import { FriendshipDocument } from "./friendship.schema";
import { GroupDocument } from "./group.schema";
import { ServerGroup } from "./server-group.schema";
import { ServerDocument } from "./server.schema";
import { UserDocument } from "./user.schema";
import { ChannelMessageDocument } from "./channel-message.schema";

export class UserDto {
  id: string;
  name: string;

  constructor(userDocument: UserDocument) {
    this.id = userDocument.id;
    this.name = userDocument.name;
  }

};

export class MyUserDto extends UserDto {
  email: string;

  constructor(userDocument: UserDocument) {
    super(userDocument);
    this.email = userDocument.email;
  }

};

export enum FriendshipStatus {
  pending = 'pending',
  accepted = 'accepted'
};

export class FriendshipDto {
  id: string;
  userId: string;
  status: FriendshipStatus;
  incoming: boolean;

  constructor(user: UserDocument | undefined, friendshipDocument: FriendshipDocument) {
    let userObjectId = friendshipDocument.user1, incoming = true;
    if (friendshipDocument.user1.toString() === user.id) {
      userObjectId = friendshipDocument.user2;
      incoming = false;
    }
    this.id = friendshipDocument.id;
    this.userId = userObjectId.toString();
    this.status = friendshipDocument.status;
    this.incoming = incoming;
  }

};

export class GroupDto {
  id: string;
  name: string;
  invitation: string;
  members: string[];

  constructor(groupDocument: GroupDocument) {
    this.id = groupDocument.id;
    this.name = groupDocument.name;
    this.invitation = groupDocument.invitation;
    this.members = groupDocument.members.map(memberId => memberId.toString());
  }

};

export class MessageDto {
  id: string;
  userId: string;
  text: string;
  timestamp: string;

  constructor(message: FriendshipMessageDocument | GroupMessageDocument) {
    this.id = message._id.toString();
    this.userId = message.userId.toString();
    this.text = message.text;
    this.timestamp = message.timestamp.toISOString();
  }

};

export class ConversationDto extends MessageDto {
  friendshipId?: string;
  groupId?: string;
  channelId?: string;

  constructor(message: FriendshipMessageDocument);
  constructor(message: GroupMessageDocument);
  constructor(message: ChannelMessageDocument);
  constructor(message: any) {
    super(message);
    this.friendshipId = (message as FriendshipMessageDocument).friendshipId?.toString();
    this.groupId = (message as GroupMessageDocument).groupId?.toString();
    this.channelId = (message as ChannelMessageDocument).channelId?.toString();
  }

};

export class ChannelDto {
  id: string;
  name: string;

  constructor(channel: Channel) {
    this.id = channel._id.toString();
    this.name = channel.name;
  }

};

export class ServerGroupDto {
  id: string;
  name?: string;
  channels: ChannelDto[];

  constructor(serverGroup: ServerGroup) {
    this.id = serverGroup._id.toString();
    this.name = serverGroup.name;
    this.channels = serverGroup.channels.map(channel => new ChannelDto(channel));
  }

};

export class ServerDto {
  id: string;
  name: string;
  invitation: string;
  groups: ServerGroupDto[];
  members: string[];

  constructor(serverDocument: ServerDocument) {
    this.id = serverDocument.id;
    this.name = serverDocument.name;
    this.invitation = serverDocument.invitation;
    this.groups = serverDocument.groups.map(group => new ServerGroupDto(group));
    this.members = serverDocument.members.map(memberId => memberId.toString());
  }

};

export type UserDataDto = MyUserDto & {
  friendships: FriendshipDto[],
  groups: GroupDto[],
  conversations: ConversationDto[],
  servers: ServerDto[],
  users: UserDto[]
};