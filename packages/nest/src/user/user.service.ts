import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Friendship, FriendshipDocument } from "src/entities/friendship.schema";
import { Message, MessageDocument } from "src/entities/message.schema";

@Injectable()
export class UserService {
  constructor(@InjectModel(Friendship.name) private readonly friendshipModel: Model<FriendshipDocument>, @InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>) {}

  createFriendship(user1Id: string, user2Id: string) {
    return new this.friendshipModel({ user1Id, user2Id });
  }

  deleteFriendship(id: string) {
    return this.friendshipModel.findByIdAndDelete(id);
  }

  async createMessage(userId: string, id: string, text: string) {
    const friend = await this.friendshipModel.findById(id);
    friend.messages.push(new this.messageModel({userId, text}));
  }

}
