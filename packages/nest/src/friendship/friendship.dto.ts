import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { Types } from "mongoose";
import { FriendshipDocument } from "../entities/friendship.schema";

export class NewFriendshipMessageDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class NewFriendshipMessageReactionDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}

export enum FriendshipStatus {
  pending = "pending",
  accepted = "accepted",
}

export class FriendshipDto {
  id: string;
  userId: string;
  status: FriendshipStatus;
  incoming: boolean;

  constructor(userId: Types.ObjectId, friendshipDocument: FriendshipDocument) {
    this.id = friendshipDocument.id;
    this.userId = userId.toString();
    this.status = friendshipDocument.status;
    this.incoming = userId.toString() === friendshipDocument.user1.toString();
  }
}

export class NewFriendshipParams {
  @IsMongoId()
  userId: string;
}

export class FriendshipParams {
  @IsMongoId()
  friendshipId: string;
}

export class FriendshipMessageParams extends FriendshipParams {
  @IsMongoId()
  messageId: string;
}
