import { Body, Controller, Param, Post } from "@nestjs/common";
import { Types } from "mongoose";
import { ChannelDto, ServerGroupParams } from "../../server.dto";
import { UserDocument } from "../../../entities/user.schema";
import { SseService } from "../../../sse.service";
import { ExtractAuthenticatedUser } from "../../../util";
import { ChannelService } from "./channel.service";

@Controller("servers/:serverId/groups/:groupId/channels")
export class ChannelController {
  constructor(private readonly channelService: ChannelService, private readonly sseService: SseService) {}

  @Post()
  async createChannel(
    @ExtractAuthenticatedUser() user: UserDocument,
    @Param() { serverId, groupId }: ServerGroupParams,
    @Body() { name }: { name: string }
  ) {
    const channel = await this.channelService.createChannel(user, serverId, groupId, name);
    this.sseService.channel(new Types.ObjectId(serverId), new ChannelDto(channel, serverId, groupId));
  }
}
