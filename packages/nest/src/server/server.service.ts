import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Server, ServerDocument } from '../entities/server.schema';
import { UserDocument } from '../entities/user.schema';
import { ServerNotFoundHttpException, UserAlreadyInServerHttpException, UserNotInServerHttpException } from './exceptions';
import { ServerGroup as Group } from '../entities/server-group.schema';
import { Channel } from '../entities/channel.schema';
import { ChannelMessage, ChannelMessageDocument } from '../entities/channel-message.schema';
import { ChannelNotFoundHttpException, GroupNotFoundHttpException } from '../group/exceptions';
import { ServerDto } from '../dtos/server.dto';
import { ChannelMessageDto } from '../dtos/message.dto';

@Injectable()
export class ServerService {

  constructor(
    @InjectModel(Server.name) private readonly serverModel: Model<ServerDocument>,
    @InjectModel(ChannelMessage.name) private readonly channelMessageModel: Model<ChannelMessageDocument>
  ) { }

  async createServer(user: UserDocument, name: string): Promise<ServerDto> {
    const textChannelsGroup = new Group('Text Channels');
    textChannelsGroup.channels.push(new Channel('general'));
    const server = await new this.serverModel({ name, groups: [new Group(), textChannelsGroup], members: [user._id] }).save();
    user.servers.push(server._id);
    await user.save();
    return new ServerDto(server);
  }

  async getServer(user: UserDocument, id: string) {
    const serverId = user.servers.find(serverId => serverId.toString() === id);
    if (serverId === undefined) throw new UserNotInServerHttpException();
    const server = await this.serverModel.findById(id);
    if (server === null) throw new ServerNotFoundHttpException();
    return server;
  }

  getServers(user: UserDocument) {
    return this.serverModel.find({ _id: { $in: user.servers } });
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
    return new ServerDto(server);
  }

  async createGroup(user: UserDocument, id: string, name: string) {
    const server = await this.getServer(user, id);
    const group = new Group(name);
    server.groups.push(group);
    await server.save();
    return group;
  }

  async getGroup(user: UserDocument, serverId: string, id: string) {
    const server = await this.getServer(user, serverId);
    const group = server.groups.find(group => group._id.toString() === id);
    if (group === undefined) throw new GroupNotFoundHttpException();
    return { server, group };
  }

  async createChannel(user: UserDocument, serverId: string, groupId: string, name: string) {
    const { server, group } = await this.getGroup(user, serverId, groupId);
    const channel = new Channel(name);
    group.channels.push(channel);
    await server.save();
    return channel;
  }

  async getChannel(user: UserDocument, serverId: string, groupId: string, id: string) {
    const { group } = await this.getGroup(user, serverId, groupId);
    const channel = group.channels.find(channel => channel._id.toString() === id);
    if (channel === undefined) throw new ChannelNotFoundHttpException();
    return channel;
  }

  async createChannelMessage(user: UserDocument, serverId: string, groupId: string, id: string, text: string) {
    const channel = await this.getChannel(user, serverId, groupId, id)
    const message = await new this.channelMessageModel({
      channelId: channel._id,
      userId: user._id,
      timestamp: new Date().getTime(),
      text
    }).save();
    return new ChannelMessageDto(message, serverId, groupId);
  }

  async getChannelMessages(user: UserDocument, serverId: string, groupId: string, id: string, offset: number, limit: number) {
    const channel = await this.getChannel(user, serverId, groupId, id);
    const messages = await this.channelMessageModel.find({ channelId: channel._id }).sort({ timestamp: -1 }).skip(offset).limit(limit);
    return messages.map(message => new ChannelMessageDto(message, serverId, groupId)).reverse();
  }

}
