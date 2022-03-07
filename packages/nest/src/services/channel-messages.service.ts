import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ChannelTypeDto } from "@rendezvous/common";
import { Model } from "mongoose";
import { ChannelMessage, ChannelMessageDocument } from "src/entities/message";
import { SocketIoService } from "src/services/socket-io.service";
import { MessageNotFoundException } from "../exceptions/NotFoundExceptions";
import { ChannelsService } from "./channels.service";

@Injectable()
export class ChannelMessagesService {
  constructor(
    @InjectModel(ChannelMessage.name)
    private readonly messageModel: Model<ChannelMessage>,
    private readonly channelsService: ChannelsService,
    private readonly socketIoService: SocketIoService
  ) {}

  async createMessage(userId: string, serverId: string, groupId: string, channelId: string, text: string, files: string[]) {
    await this.channelsService.getByIdAndType(userId, { serverId, groupId, channelId }, ChannelTypeDto.text);

    const newMessage = new this.messageModel({
      channelId,
      userId,
      text,
      timestamp: new Date(),
      files,
    });
    await newMessage.save();

    this.socketIoService.newChannelMessage({ serverId, groupId, channelId }, ChannelMessage.toDTO(newMessage, serverId, groupId));
  }

  async getById(userId: string, serverId: string, groupId: string, channelId: string, messageId: string) {
    const channel = await this.channelsService.getById(userId, serverId, groupId, channelId);
    let message: ChannelMessageDocument;
    try {
      message = await this.messageModel.findOne({ _id: messageId, channelId });
    } catch (e) {
      throw new MessageNotFoundException();
    }
    if (message === undefined || message === null) throw new MessageNotFoundException();
    return { message, channel };
  }

  async getMessages(userId: string, serverId: string, groupId: string, channelId: string, offset: number) {
    await this.channelsService.getByIdAndType(userId, { serverId, groupId, channelId }, ChannelTypeDto.text);

    const messages = await this.messageModel
      .find({
        channelId,
      })
      .sort({ timestamp: -1 })
      .skip(offset)
      .limit(30);

    return messages.map((message) => ChannelMessage.toDTO(message, serverId, groupId));
  }

  async deleteMessage(userId: string, serverId: string, groupId: string, channelId: string, messageId: string) {
    await this.channelsService.getByIdAndType(userId, { serverId, groupId, channelId }, ChannelTypeDto.text);

    let message;

    try {
      message = await this.messageModel.findOneAndDelete({
        _id: messageId,
        serverId,
        groupId,
        channelId,
      });
    } catch (e) {
      throw new MessageNotFoundException();
    }
    if (message === null || message === undefined) throw new MessageNotFoundException();

    this.socketIoService.channelMessageDeleted({
      serverId,
      groupId,
      channelId,
      messageId,
    });
  }
}
