import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Server, ServerDocument } from "../entities/server.schema";
import { UserDocument } from "../entities/user.schema";
import { ServerNotFoundHttpException, UserAlreadyInServerHttpException, UserNotInServerHttpException } from "./exceptions";
import { ServerGroup as Group } from "../entities/server-group.schema";
import { Channel } from "../entities/channel.schema";
import { ServerDto } from "../dtos/server.dto";

@Injectable()
export class ServerService {
  constructor(@InjectModel(Server.name) private readonly serverModel: Model<ServerDocument>) {}

  async createServer(user: UserDocument, name: string) {
    const textChannelsGroup = new Group("Text Channels");
    textChannelsGroup.channels.push(new Channel("general"));
    const server = await new this.serverModel({ name, groups: [new Group(), textChannelsGroup], members: [user._id] }).save();
    user.servers.push(server._id);
    await user.save();
    return server;
  }

  async getServer(user: UserDocument, id: string) {
    const serverId = user.servers.find((serverId) => serverId.toString() === id);
    if (serverId === undefined) throw new UserNotInServerHttpException();
    const server = await this.serverModel.findById(id);
    if (server === null) throw new ServerNotFoundHttpException();
    return server;
  }

  getServers(user: UserDocument) {
    return this.serverModel.find({ _id: { $in: user.servers } });
  }

  async deleteServerInvitation(user: UserDocument, id: string) {
    const serverId = user.servers.find((serverId) => serverId.toString() === id);
    if (serverId === undefined) throw new UserNotInServerHttpException();
    const server = await this.serverModel.findById(id);
    if (server === null) throw new ServerNotFoundHttpException();
    server.invitation = null;
    await server.save();
  }

  async createMemberSelf(user: UserDocument, invitation: string) {
    const server = await this.serverModel.findOne({ invitation });
    if (server === null) throw new ServerNotFoundHttpException();
    const serverId = user.servers.find((serverId) => serverId.toString() === server.id);
    if (serverId !== undefined) throw new UserAlreadyInServerHttpException();
    server.members.push(user._id);
    user.servers.push(server._id);
    await Promise.all([server.save(), user.save()]);
    return new ServerDto(server);
  }
}
