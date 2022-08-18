import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Server, ServerDocument } from '../entities/server.schema';
import { UserDocument } from '../entities/user.schema';
import { ServerNotFoundHttpException, UserAlreadyInServerHttpException, UserNotInServerHttpException } from './exceptions';
import { v4 as uuid } from 'uuid';
import { ServerGroup } from '../entities/server-group.schema';

@Injectable()
export class ServerService {

  constructor(
    @InjectModel(Server.name) private readonly serverModel: Model<ServerDocument>
  ) { }

  async createServer(user: UserDocument, name: string) {
    const group = new ServerGroup();
    const server = await new this.serverModel({ name, groups: [group], members: [user._id] }).save();
    user.servers.push(server._id);
    await user.save();
    return server;
  }

  async getServers(user: UserDocument) {
    const servers = await this.serverModel.find({_id: {$in: user.servers}});
    return servers.map(server => ({
      id: server.id,
      name: server.name,
      invitation: server.invitation,
      groups: server.groups,
      members: server.members
    }))
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

}
