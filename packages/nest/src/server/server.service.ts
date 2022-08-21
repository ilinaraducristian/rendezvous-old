import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Server, ServerDocument } from '../entities/server.schema';
import { UserDocument } from '../entities/user.schema';
import { ServerNotFoundHttpException, UserAlreadyInServerHttpException, UserNotInServerHttpException } from './exceptions';
import { v4 as uuid } from 'uuid';
import { ServerGroup } from '../entities/server-group.schema';
import { Channel } from '../entities/channel.schema';
import { ChannelMessage, ChannelMessageDocument } from '../entities/channel-message.schema';
import { ServerDto } from '../entities/user-data.dto';
import { ChannelNotFoundHttpException, GroupNotFoundHttpException } from '../group/exceptions';

@Injectable()
export class ServerService {

  constructor(
    @InjectModel(Server.name) private readonly serverModel: Model<ServerDocument>,
    @InjectModel(ChannelMessage.name) private readonly channelMessageModel: Model<ChannelMessageDocument>
  ) { }

  async createServer(user: UserDocument, name: string): Promise<ServerDto> {
    const group = new ServerGroup();
    const textChannelsGroup = new ServerGroup('Text Channels');
    textChannelsGroup.channels.push(new Channel('general'));
    const server = await new this.serverModel({ name, groups: [group, textChannelsGroup], members: [user._id] }).save();
    user.servers.push(server._id);
    await user.save();
    return new ServerDto(server);
  }

  async getServers(user: UserDocument): Promise<ServerDto[]> {
    return (await this.serverModel.find({_id: {$in: user.servers}})).map(server => new ServerDto(server));
  }

  async createServerInvitation(user: UserDocument, id: string) {
    const serverId = user.servers.find(serverId => serverId.toString() === id);
    if (serverId === undefined) throw new UserNotInServerHttpException();
    const server = await this.serverModel.findById(id);
    if (server === null) throw new ServerNotFoundHttpException();
    server.invitation = uuid();
    await server.save();
    return server.invitation;
  }

  async deleteServerInvitation(user: UserDocument, id: string) {
    const serverId = user.servers.find(serverId => serverId.toString() === id);
    if (serverId === undefined) throw new UserNotInServerHttpException();
    const server = await this.serverModel.findById(id);
    if (server === null) throw new ServerNotFoundHttpException();
    server.invitation = null;
    await server.save();
  }

  async createMemberSelf(user: UserDocument, invitation: string) {
    const server = await this.serverModel.findOne({ invitation });
    if (server === null) throw new ServerNotFoundHttpException();
    const serverId = user.servers.find(serverId => serverId.toString() === server.id);
    if (serverId !== undefined) throw new UserAlreadyInServerHttpException();
    server.members.push(user._id);
    user.servers.push(server._id);
    await Promise.all([server.save(), user.save()]);
  }

  async createGroup(user: UserDocument, id: string, name: string) {
    const serverId = user.servers.find(serverId => serverId.toString() === id);
    if (serverId === undefined) throw new UserNotInServerHttpException();
    const server = await this.serverModel.findById(id);
    if (server === null) throw new ServerNotFoundHttpException();
    const group = new ServerGroup(name);
    server.groups.push(group);
    await server.save();
    return group;
  }

  async createChannel(user: UserDocument, id: string, groupId: string, name: string) {
    const serverId = user.servers.find(serverId => serverId.toString() === id);
    if (serverId === undefined) throw new UserNotInServerHttpException();
    const server = await this.serverModel.findById(id);
    if (server === null) throw new ServerNotFoundHttpException();
    const group = server.groups.find(group => group._id.toString() === groupId);
    if(group === undefined) throw new GroupNotFoundHttpException();
    const channel = new Channel(name);
    group.channels.push(channel);
    await server.save();
    return channel;
  }

  async createChannelMessage(user: UserDocument, id: string, groupId: string, channelId: string, text: string) {
    const serverId = user.servers.find(serverId => serverId.toString() === id);
    if (serverId === undefined) throw new UserNotInServerHttpException();
    const server = await this.serverModel.findById(id);
    if (server === null) throw new ServerNotFoundHttpException();
    const group = server.groups.find(group => group._id.toString() === groupId);
    if(group === undefined) throw new GroupNotFoundHttpException();
    const channel = group.channels.find(channel => channel._id.toString() === channelId);
    if(channel === undefined) throw new ChannelNotFoundHttpException();
    const message = await new this.channelMessageModel({
      channelId: channel._id,
      userId: user._id,
      timestamp: new Date(),
      text}).save();
    return message;
  }

}
