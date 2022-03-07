import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ChannelTypeDto, ServerDto } from "@rendezvous/common";
import { Model } from "mongoose";
import { ChannelMessage } from "src/entities/message";
import UpdateServerRequest from "src/requests/update-server-request";
import { v4 as uuid } from "uuid";
import Member from "../entities/member";
import Server from "../entities/server";
import { AlreadyMemberException, BadOrExpiredInvitationException, NotAMemberException } from "../exceptions/BadRequestExceptions";
import { ServerNotFoundException } from "../exceptions/NotFoundExceptions";
import { SocketIoService } from "./socket-io.service";
import { UsersService } from "./users.service";

@Injectable()
export class ServersService {
  constructor(
    @InjectModel(Server.name) private readonly serverModel: Model<Server>,
    @InjectModel(ChannelMessage.name)
    private readonly messageModel: Model<ChannelMessage>,
    private readonly membersService: UsersService,
    private readonly socketIoService: SocketIoService
  ) {}

  async createServer(userId: string, name: string): Promise<ServerDto> {
    let newServer = new this.serverModel({ name });
    const servers = await this.membersService.getUserLastServer(userId);
    let newOrder = 0;
    if (servers.length > 0) newOrder = servers[0].order + 1;

    const defaultGroup = {
      name: "default",
      order: 0,
      channels: [],
    };

    const textGroup = {
      name: "Text Channels",
      order: 1,
      channels: [
        {
          name: "general",
          order: 0,
          type: ChannelTypeDto.text,
        },
      ],
    };
    const voiceGroup = {
      name: "Voice Channels",
      order: 2,
      channels: [
        {
          name: "General",
          order: 0,
          type: ChannelTypeDto.voice,
        },
      ],
    };

    const newMember = this.membersService.newMember({
      userId,
      serverId: newServer.id,
      order: newOrder,
    });

    newServer.groups.push(defaultGroup, textGroup, voiceGroup);
    newServer.members.push(newMember.id);

    await Promise.all([newServer.save(), newMember.save()]);
    newServer.members = [newMember];
    const serverDto = Server.toDTO(newServer);
    serverDto.order = newOrder;
    await this.socketIoService.joinServer(userId, serverDto.id);
    return serverDto;
  }

  async getById(userId: string, serverId: string) {
    const serverExists = await this.serverModel.exists({ serverId });
    if (!serverExists) throw new ServerNotFoundException();
    const isMember = await this.membersService.isMember(userId, serverId);
    if (isMember === false) throw new NotAMemberException();
    return this.serverModel.findById(serverId);
  }

  async createInvitation(userId: string, id: string) {
    const isMember = await this.membersService.isMember(userId, id);
    if (isMember === false) throw new NotAMemberException();
    const server = await this.serverModel.findById(id);
    if (server.invitation === null || server.invitation?.exp < new Date()) {
      server.invitation = {
        link: uuid(),
        exp: new Date(),
      };
      server.invitation.exp.setDate(server.invitation.exp.getDate() + 7);
    }
    await server.save();
    return server.invitation;
  }

  async createMember(userId: string, invitation: string) {
    let server;
    try {
      server = await this.serverModel.findOne({ "invitation.link": invitation }).populate("members");
    } catch (e) {
      throw new BadOrExpiredInvitationException();
    }
    if (server === null || new Date() > server.date) throw new BadOrExpiredInvitationException();
    const isMember = await this.membersService.isMember(userId, server.id);
    if (isMember === true) throw new AlreadyMemberException();
    const servers = await this.membersService.getUserLastServer(userId);
    const newOrder = (servers[0]?.order ?? -1) + 1;

    const newMember = this.membersService.newMember({
      userId,
      serverId: server.id,
      order: newOrder,
    });
    server.members.push(newMember.id);
    await Promise.all([newMember.save(), server.save()]);
    this.socketIoService.newMember(server.id, Member.toDTO(newMember));
    server = await this.serverModel.findById(server.id).populate("members");
    const newServer = Server.toDTO(server);
    newServer.order = newOrder;
    newServer.members = server.members.map((member) => Member.toDTO(member));
    await this.socketIoService.joinServer(userId, newServer.id);
    return newServer;
  }

  async deleteMember(userId: string, serverId: string) {
    let member: Member;
    try {
      member = await this.membersService.deleteMember(userId, serverId);
    } catch (e) {
      throw new NotAMemberException();
    }
    if (member === undefined || member === null) throw new NotAMemberException();
    await this.socketIoService.leaveServer(userId, member.serverId.toString());
    this.socketIoService.memberLeft({
      serverId: member.serverId.toString(),
      memberId: member._id.toString(),
    });
    await this.fixServersOrder([userId]);
  }

  async updateServer(userId: string, id: string, serverUpdate: UpdateServerRequest) {
    const isMember = await this.membersService.isMember(userId, id);
    if (isMember === false) throw new NotAMemberException();

    if (serverUpdate.name !== undefined) {
      let newServer;
      try {
        newServer = await this.serverModel.findOneAndUpdate({ _id: id }, { name: serverUpdate.name }, { new: true });
      } catch (e) {
        throw new ServerNotFoundException();
      }
      if (newServer === null || newServer === undefined) throw new ServerNotFoundException();
    }

    return { name: serverUpdate.name, servers: [] };
  }

  async deleteServer(userId: string, serverId: string): Promise<void> {
    const server = await this.getById(userId, serverId);

    const members = await this.membersService.getMembers(serverId);
    const membersUserIds = members.map((member) => member.userId);
    const textChannelsIds = server.groups
      .map((group) => group.channels)
      .flat()
      .filter((channel) => channel.type === ChannelTypeDto.text)
      .map((channel) => ({ channelId: channel._id.toString() }));
    await this.messageModel.deleteMany({ $or: textChannelsIds });

    try {
      await Promise.all([this.serverModel.findOneAndRemove({ _id: serverId }), this.membersService.deleteServerMembers(serverId)]);
      await this.fixServersOrder(membersUserIds);
    } catch (e) {
      throw e;
    }
    this.socketIoService.serverDeleted(serverId);
  }

  private async fixServersOrder(membersUserIds: string[]) {
    await Promise.all(
      membersUserIds.map((memberUserId) =>
        this.membersService.getUserSortedServers(memberUserId).then((servers) =>
          this.membersService.saveMembers(
            servers.map((server, i) => {
              server.order = i;
              return server;
            })
          )
        )
      )
    );
  }
}
