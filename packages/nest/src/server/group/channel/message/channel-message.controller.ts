import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { Types } from "mongoose";
import { ChannelMessageDto } from "../../../../dtos/message.dto";
import { UserDocument } from "../../../../entities/user.schema";
import { ObjectIdPipe } from "../../../../object-id.pipe";
import { SseService } from "../../../../sse.service";
import { ExtractAuthenticatedUser } from "../../../../util";
import { ChannelMessageService } from "./channel-message.service";

@Controller("servers/:serverId/groups/:groupId/channels/:channelId/messages")
export class ChannelMessageController {
  constructor(private readonly channelMessageService: ChannelMessageService, private readonly sseService: SseService) {}

  @Post()
  async createChannelMessage(
    @ExtractAuthenticatedUser() user: UserDocument,
    @Param("serverId", new ObjectIdPipe()) serverId: string,
    @Param("groupId", new ObjectIdPipe()) groupId: string,
    @Param("channelId", new ObjectIdPipe()) channelId: string,
    @Body() { text }: { text: string }
  ) {
    const message = await this.channelMessageService.createChannelMessage(user, serverId, groupId, channelId, text);
    this.sseService.channelMessage(new Types.ObjectId(serverId), new ChannelMessageDto(message, serverId, groupId));
    return message;
  }

  @Get()
  getChannelMessages(
    @ExtractAuthenticatedUser() user: UserDocument,
    @Param("serverId", new ObjectIdPipe()) serverId: string,
    @Param("groupId", new ObjectIdPipe()) groupId: string,
    @Param("channelId", new ObjectIdPipe()) channelId: string,
    @Query("offset") offset = 0,
    @Query("limit") limit = 100
  ) {
    return this.channelMessageService.getChannelMessages(user, serverId, groupId, channelId, offset, limit);
  }
}
