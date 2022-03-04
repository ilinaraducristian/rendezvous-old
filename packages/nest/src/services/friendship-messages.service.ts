import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FriendshipMessage } from "src/entities/message";
import { SocketIoService } from "src/services/socket-io.service";
import { MessageNotFoundException } from "../exceptions/NotFoundExceptions";
import { FriendshipsService } from "./friendships.service";

@Injectable()
export class FriendshipMessagesService {
  constructor(
    @InjectModel(FriendshipMessage.name)
    private readonly messageModel: Model<FriendshipMessage>,
    private readonly friendshipsService: FriendshipsService,
    private readonly socketioService: SocketIoService
  ) {}

  async createMessage(userId: string, friendshipId: string, text: string) {
    const friendship = await this.friendshipsService.getById(userId, friendshipId);

    const newMessage = new this.messageModel({
      friendshipId,
      userId,
      text,
      timestamp: new Date(),
    });
    await newMessage.save();

    this.socketioService.newFriendshipMessage(friendship.id, friendship.user1Id, friendship.user2Id, FriendshipMessage.toDTO(newMessage));
  }

  async getMessages(userId: string, friendshipId: string, offset: number) {
    await this.friendshipsService.getById(userId, friendshipId);
    const messages = await this.messageModel
      .find({
        friendshipId,
      })
      .sort({ timestamp: -1 })
      .skip(offset)
      .limit(30);

    return messages.map((message) => FriendshipMessage.toDTO(message));
  }

  async deleteMessage(userId: string, friendshipId: string, messageId: string) {
    await this.friendshipsService.getById(userId, friendshipId);

    let message;

    try {
      message = await this.messageModel.findOneAndDelete({
        _id: messageId,
        friendshipId,
        userId,
      });
    } catch (e) {
      throw new MessageNotFoundException();
    }
    if (message === null || message === undefined) throw new MessageNotFoundException();
  }
}
