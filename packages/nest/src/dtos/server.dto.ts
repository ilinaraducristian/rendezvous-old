import { Channel } from "../entities/channel.schema";
import { ServerGroup as Group } from "../entities/server-group.schema";
import { ServerDocument } from "../entities/server.schema";

export class ChannelDto {
  id: string;
  name: string;

  constructor(channel: Channel) {
    this.id = channel._id.toString();
    this.name = channel.name;
  }

};

export class GroupDto {
  id: string;
  name?: string;
  channels: ChannelDto[];

  constructor(group: Group) {
    this.id = group._id.toString();
    this.name = group.name;
    this.channels = group.channels.map(channel => new ChannelDto(channel));
  }

};

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
    this.groups = serverDocument.groups.map(group => new GroupDto(group));
    this.members = serverDocument.members.map(memberId => memberId.toString());
  }

};