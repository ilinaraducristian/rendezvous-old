import { Injectable } from "@nestjs/common";
import NewReactionRequest from "src/requests/new-reaction-request";
import { ServerDocument } from "../entities/server";
import { EmojiNotFoundException, ReactionNotFoundException } from "../exceptions/NotFoundExceptions";
import { ChannelMessagesService } from "./channel-messages.service";

@Injectable()
export class ReactionsService {
  constructor(private readonly channelMessagesService: ChannelMessagesService) {}

  async createReaction(userId: string, serverId: string, groupId: string, channelId: string, messageId: string, newReaction: NewReactionRequest) {
    const { message, channel } = await this.channelMessagesService.getById(userId, serverId, groupId, channelId, messageId);
    if (newReaction.serverEmoji) {
      const server = channel.$parent().$parent() as ServerDocument;
      const emoji = server.emojis.find((emoji) => emoji._id.toString() === newReaction.emoji);
      if (emoji === undefined) throw new EmojiNotFoundException();
    }
    message.reactions.push(newReaction);
    await message.save();
  }

  async deleteReaction(userId: string, serverId: string, groupId: string, channelId: string, messageId: string, reactionId: string) {
    const { message } = await this.channelMessagesService.getById(userId, serverId, groupId, channelId, messageId);
    const index = message.reactions.findIndex((reaction) => reaction._id.toString() === reactionId);
    if (index === -1) throw new ReactionNotFoundException();
    message.reactions.splice(index, 1);
    await message.save();
  }
}
