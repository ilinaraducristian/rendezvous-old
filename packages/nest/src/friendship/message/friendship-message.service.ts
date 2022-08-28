import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { FriendshipMessageReactionDto } from "../../dtos/message.dto";
import { FriendshipMessage, FriendshipMessageDocument } from "../../entities/friendship-message.schema";
import Reaction from "../../entities/reaction.schema";
import { UserDocument } from "../../entities/user.schema";
import { extractOtherId } from "../../util";
import { FriendshipMessageNotFoundHttpException } from "../exceptions";
import { FriendshipService } from "../friendship.service";

@Injectable()
export class FriendshipMessageService {
  constructor(
    private readonly friendshipService: FriendshipService,
    @InjectModel(FriendshipMessage.name) private readonly friendshipMessageModel: Model<FriendshipMessageDocument>
  ) {}

  async createFriendshipMessage(user: UserDocument, id: string, text: string, replyId: string = null) {
    const friendship = await this.friendshipService.getFriendship(user, id);
    // const replyMesage = await this.friendshipMessageModel.findOne({_id: new Types.ObjectId(replyId), friendshipId: friendship._id});
    // if(replyMesage === null) throw new ReplyMessageDoesntExistHttpException();

    const message = await new this.friendshipMessageModel({
      friendshipId: friendship._id,
      userId: user._id,
      timestamp: new Date().getTime(),
      text,
      // replyId: replyMesage?._id
    }).save();

    message.friendship = friendship;
    return message;
  }

  async getFriendshipMessage(user: UserDocument, friendshipId: string, id: string) {
    const friendship = await this.friendshipService.getFriendship(user, friendshipId);
    const message = await this.friendshipMessageModel.findOne({ _id: new Types.ObjectId(id), friendshipId: friendship._id });
    if (message === null) throw new FriendshipMessageNotFoundHttpException();
    message.friendship = friendship;
    return message;
  }

  async getFriendshipMessages(user: UserDocument, id: string, offset: number, limit: number) {
    const friendship = await this.friendshipService.getFriendship(user, id);
    const messages = await this.friendshipMessageModel.find({ friendshipId: friendship._id }).sort({ timestamp: -1 }).skip(offset).limit(limit);
    return messages;
  }

  async editMessage(user: UserDocument, friendshipId: string, messageId: string, text: string) {
    const message = await this.getFriendshipMessage(user, friendshipId, messageId);
    message.text = text;
    return await message.save();
  }

  async deleteFriendshipMessage(user: UserDocument, friendshipId: string, id: string) {
    const friendship = await this.friendshipService.getFriendship(user, friendshipId);
    const message = await this.friendshipMessageModel.findOneAndRemove({ _id: new Types.ObjectId(id), friendshipId: friendship._id });
    if (message === null) throw new FriendshipMessageNotFoundHttpException();
    message.friendship = friendship;
    return message;
  }

  async deleteFriendshipMessages(user: UserDocument, id: string) {
    const friendship = await this.friendshipService.getFriendship(user, id);
    const messages = await this.friendshipMessageModel.deleteMany({ friendshipId: friendship._id });
    if (messages.deletedCount === 0) throw new FriendshipMessageNotFoundHttpException();
    const otherId = extractOtherId(user, friendship);
  }

  async createFriendshipMessageReaction(user: UserDocument, friendshipId: string, id: string, text: string) {
    const message = await this.getFriendshipMessage(user, friendshipId, id);
    const reaction = new Reaction(user._id, text);
    message.reactions.push(reaction);
    await message.save();
    return new FriendshipMessageReactionDto(reaction, friendshipId, id);
  }
}
