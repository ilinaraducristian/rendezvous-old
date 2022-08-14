import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDocument } from "../entities/user.schema";
import { FriendshipMessage, FriendshipMessageDocument } from "../friendship/entities/friendship-message.schema";
import { GroupMessage, GroupMessageDocument } from "../group/entities/group-message.schema";

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(FriendshipMessage.name) private readonly friendshipMessageModel: Model<FriendshipMessageDocument>,
    @InjectModel(GroupMessage.name) private readonly groupMessageModel: Model<GroupMessageDocument>
  ) { }

  async getConversations(user: UserDocument) {
    const promises: any[] = [...user.friendships.map(friendshipId => this.friendshipMessageModel.find({ friendshipId }).sort({ timestamp: -1 }).limit(1)), ...user.groups.map(groupId => this.groupMessageModel.find({ groupId }).sort({ timestamp: -1 }).limit(1))]
    const messages = await Promise.all(promises);
    const messagess = messages.flat().map(message => ({
      friendshipId: message.friendshipId?.toString(),
      groupId: message.groupId?.toString(),
      id: message.id,
      userId: message.userId.toString(),
      timestamp: message.timestamp,
      text: message.text
    }
    ));
    return messagess.sort((message1, message2) => message2.timestamp.getTime() - message1.timestamp.getTime());
  }

}
