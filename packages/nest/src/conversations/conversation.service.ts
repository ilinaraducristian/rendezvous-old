import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ConversationDto } from "../entities/user-data.dto";
import { UserDocument } from "../entities/user.schema";
import { FriendshipMessage, FriendshipMessageDocument } from "../friendship/entities/friendship-message.schema";
import { GroupMessage, GroupMessageDocument } from "../group/entities/group-message.schema";

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(FriendshipMessage.name) private readonly friendshipMessageModel: Model<FriendshipMessageDocument>,
    @InjectModel(GroupMessage.name) private readonly groupMessageModel: Model<GroupMessageDocument>
  ) { }

  async getConversations(user: UserDocument): Promise<ConversationDto[]> {
    const [friendshipMessagesResult, groupMessagesResult] = await Promise.all([
      this.friendshipMessageModel.aggregate([
        {
          $match: {
            friendshipId: { $in: user.friendships }
          },
        },
        {
          $sort: {
            timestamp: -1
          }
        },
        {
          $group: {
            _id: "$friendshipId",
            message: {
              $first: "$$ROOT"
            }
          }
        }
      ]),
      this.groupMessageModel.aggregate([
        {
          $match: {
            groupId: { $in: user.groups }
          },
        },
        {
          $sort: {
            timestamp: -1
          }
        },
        {
          $group: {
            _id: "$groupId",
            message: {
              $first: "$$ROOT"
            }
          }
        }
      ])
    ]);
    const friendshipMessages = friendshipMessagesResult.map(result => result.message);
    const groupMessages = groupMessagesResult.map(result => result.message);
    return friendshipMessages.concat(groupMessages).sort((message1, message2) => message2.timestamp.getTime() - message1.timestamp.getTime()).map(conversation => new ConversationDto(conversation));
  }

}
