import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Friendship, FriendshipDocument } from "../entities/friendship.schema";
import { UserDocument } from "../entities/user.schema";
import { FriendshipMessage, FriendshipMessageDocument } from "../friendship/entities/friendship-message.schema";

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Friendship.name) private readonly friendshipModel: Model<FriendshipDocument>,
    @InjectModel(FriendshipMessage.name) private readonly friendshipMessageModel: Model<FriendshipMessageDocument>
  ) { }

  async getConversations(user: UserDocument) {
    const friendships = await this.friendshipModel.find({ $or: [{ user1: user._id }, { user2: user._id }] });
    const friendshipsMessages = await Promise.all(friendships.map(friendship => this.friendshipMessageModel.find({ friendshipId: friendship._id }).sort({ timestamp: -1 }).limit(1)));
    const friendshipsWithAMessage = friendshipsMessages.flat().map(friendshipMessage => ({
      friendshipId: friendshipMessage.friendshipId.toString(),
      id: friendshipMessage.id,
      userId: friendshipMessage.userId.toString(),
      timestamp: friendshipMessage.timestamp,
      text: friendshipMessage.text
    }
    ));
    return friendshipsWithAMessage.sort((friendship1, friendship2) => friendship2.timestamp.getTime() - friendship1.timestamp.getTime());
  }

}
