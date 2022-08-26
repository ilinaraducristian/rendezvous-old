import { Body, Controller, Param, Post } from "@nestjs/common";
import { Types } from "mongoose";
import { ChannelDto } from "../../../dtos/server.dto";
import { UserDocument } from "../../../entities/user.schema";
import { ObjectIdPipe } from "../../../object-id.pipe";
import { SseService } from "../../../sse.service";
import { ExtractAuthenticatedUser } from "../../../util";
import { ChannelService } from "./channel.service";

@Controller("servers/:serverId/groups/:groupId/channels")
export class ChannelController {
  constructor(private readonly channelService: ChannelService, private readonly sseService: SseService) {}

  @Post()
  async createChannel(
    @ExtractAuthenticatedUser() user: UserDocument,
    @Param("serverId", new ObjectIdPipe()) serverId: string,
    @Param("groupId", new ObjectIdPipe()) groupId: string,
    @Body() { name }: { name: string }
  ) {
    const channel = await this.channelService.createChannel(user, serverId, groupId, name);
    this.sseService.channel(new Types.ObjectId(serverId), new ChannelDto(channel, serverId, groupId));
  }
}
