import { IsNotEmpty, IsString } from "class-validator";
import { FriendshipDocument } from "../entities/friendship.schema";
import { UserDocument } from "../entities/user.schema";

export class NewFriendshipDto {
  @IsString()
  @IsNotEmpty()
  id: string;
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

  constructor(user: UserDocument, friendshipDocument: FriendshipDocument) {
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