import { Injectable } from "@nestjs/common";
import { Channel } from "../../../entities/channel.schema";
import { UserDocument } from "../../../entities/user.schema";
import { ChannelNotFoundHttpException } from "../../../group/exceptions";
import { ServerGroupService } from "../server-group.service";

@Injectable()
export class ChannelService {
  constructor(private readonly serverGroupService: ServerGroupService) {}

  async createChannel(user: UserDocument, serverId: string, groupId: string, name: string) {
    const { server, group } = await this.serverGroupService.getGroup(user, serverId, groupId);
    const channel = new Channel(name);
    group.channels.push(channel);
    await server.save();
    return channel;
  }

  async getChannel(user: UserDocument, serverId: string, groupId: string, id: string) {
    const { group } = await this.serverGroupService.getGroup(user, serverId, groupId);
    const channel = group.channels.find((channel) => channel._id.toString() === id);
    if (channel === undefined) throw new ChannelNotFoundHttpException();
    return channel;
  }
}
