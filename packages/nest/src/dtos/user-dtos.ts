import { UserDocument } from "../entities/user.schema";
import { ServerDto } from "./server.dto";
import { MessageDto } from "./message.dto";
import { FriendshipDto } from "../friendship/friendship.dto";
import { GroupDto } from "../group/group.dto";

export class UserDto {
  id: string;
  name: string;

  constructor(userDocument: UserDocument) {
    this.id = userDocument.id;
    this.name = userDocument.name;
  }
}

export class MyUserDto extends UserDto {
  email: string;

  constructor(userDocument: UserDocument) {
    super(userDocument);
    this.email = userDocument.email;
  }
}

export type ConversationsDto = MessageDto[];

export type UserDataDto = MyUserDto & {
  friendships: FriendshipDto[];
  groups: GroupDto[];
  conversations: ConversationsDto;
  servers: ServerDto[];
  users: UserDto[];
};
