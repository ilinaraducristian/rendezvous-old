import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ChannelMessageDto } from "../../../../dtos/message.dto";
import { ChannelMessage, ChannelMessageDocument } from "../../../../entities/channel-message.schema";
import { UserDocument } from "../../../../entities/user.schema";
import { ChannelService } from "../channel.service";

@Injectable()
export class ChannelMessageService {
  constructor(
    @InjectModel(ChannelMessage.name) private readonly channelMessageModel: Model<ChannelMessageDocument>,
    private readonly channelService: ChannelService
  ) {}

  async createChannelMessage(user: UserDocument, serverId: string, groupId: string, id: string, text: string) {
    const channel = await this.channelService.getChannel(user, serverId, groupId, id);
    const message = await new this.channelMessageModel({
      channelId: channel._id,
      userId: user._id,
      timestamp: new Date().getTime(),
      text,
    }).save();
    return message;
  }

  async getChannelMessages(user: UserDocument, serverId: string, groupId: string, id: string, offset: number, limit: number) {
    const channel = await this.channelService.getChannel(user, serverId, groupId, id);
    const messages = await this.channelMessageModel.find({ channelId: channel._id }).sort({ timestamp: -1 }).skip(offset).limit(limit);
    return messages.map((message) => new ChannelMessageDto(message, serverId, groupId)).reverse();
  }
}
