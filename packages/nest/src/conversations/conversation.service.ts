import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDocument } from "../entities/user.schema";
import { FriendshipMessage, FriendshipMessageDocument } from "../entities/friendship-message.schema";
import { GroupMessage, GroupMessageDocument } from "../entities/group-message.schema";
import { ConversationsDto } from "../dtos/user-dtos";
import { FriendshipMessageDto, GroupMessageDto, MessageDto, ReactionDto } from "../dtos/message.dto";

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(FriendshipMessage.name) private readonly friendshipMessageModel: Model<FriendshipMessageDocument>,
    @InjectModel(GroupMessage.name) private readonly groupMessageModel: Model<GroupMessageDocument>
  ) { }

  async getConversations(user: UserDocument) {
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
    return friendshipMessagesResult.concat(groupMessagesResult).map(({ message }) => message).sort((message1, message2) => message2.timestamp - message1.timestamp);
  }

}
