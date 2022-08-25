import { IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";
import { FriendshipDocument } from "../entities/friendship.schema";

export class NewFriendshipDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class NewFriendshipMessageDto {
  @IsString()
  @IsNotEmpty()
  text: string
}

export class NewFriendshipMessageReactionDto {
  @IsString()
  @IsNotEmpty()
  text: string
}

export enum FriendshipStatus {
  pending = 'pending',
  accepted = 'accepted'
};

export class FriendshipDto {
  id: string;
  userId: string;
  status: FriendshipStatus;
  incoming: boolean;

  constructor(userId: Types.ObjectId, friendshipDocument: FriendshipDocument) {
    this.id = friendshipDocument.id;
    this.userId = userId.toString();
    this.status = friendshipDocument.status;
    this.incoming = userId.toString() === friendshipDocument.user2.toString();
  }

};