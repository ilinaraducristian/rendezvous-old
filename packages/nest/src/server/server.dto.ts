import { IsMongoId } from "class-validator";
import { Channel } from "../entities/channel.schema";
import { ServerGroup as Group } from "../entities/server-group.schema";
import { ServerDocument } from "../entities/server.schema";

export class ChannelDto {
  id: string;
  name: string;
  serverId: string;
  groupId: string;

  constructor(channel: Channel, serverId: string, groupId: string) {
    this.id = channel._id.toString();
    this.name = channel.name;
    this.serverId = serverId;
    this.groupId = groupId;
  }
}

export class GroupDto {
  id: string;
  name?: string;
  serverId: string;
  channels: ChannelDto[];

  constructor(group: Group, serverId: string) {
    this.id = group._id.toString();
    this.name = group.name;
    this.channels = group.channels.map((channel) => new ChannelDto(channel, serverId, this.id));
    this.serverId = serverId;
  }
}

export class ServerDto {
  id: string;
  name: string;
  invitation: string;
  groups: GroupDto[];
  members: string[];

  constructor(serverDocument: ServerDocument) {
    this.id = serverDocument.id;
    this.name = serverDocument.name;
    this.invitation = serverDocument.invitation;
    this.groups = serverDocument.groups.map((group) => new GroupDto(group, this.id));
    this.members = serverDocument.members.map((memberId) => memberId.toString());
  }
}

export class ServerParams {
  @IsMongoId()
  serverId: string;
}

export class ServerGroupParams extends ServerParams {
  @IsMongoId()
  groupId: string;
}

export class ChannelParams extends ServerGroupParams {
  @IsMongoId()
  channelId: string;
}

export class ChannelMessageParams extends ChannelParams {
  @IsMongoId()
  messageId: string;
}