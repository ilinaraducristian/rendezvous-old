import { FriendshipDocument } from "../entities/friendship.schema";
import { GroupDocument } from "../entities/group.schema";
import { UserDocument } from "../entities/user.schema";
import { ServerDto } from "./server.dto";
import { MessageDto } from "./message.dto";

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

export type ConversationsDto = MessageDto[];

export type UserDataDto = MyUserDto & {
  friendships: FriendshipDto[],
  groups: GroupDto[],
  conversations: ConversationsDto,
  servers: ServerDto[],
  users: UserDto[]
};