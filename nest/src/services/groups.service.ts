import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ChannelType } from "../dtos/channel";
import UpdateGroupRequest from "../dtos/requests/update-group-request";
import Group, { GroupDocument } from "../entities/group";
import { ServerDocument } from "../entities/server";
import { DefaultGroupCannotBeDeletedException } from "../exceptions/BadRequestExceptions";
import { GroupNotFoundException } from "../exceptions/NotFoundExceptions";
import { ServersService } from "./servers.service";
import { SocketIoService } from "./socket-io.service";
import { changeDocumentOrder, getMaxOrder } from "../util";
import { ChannelMessage } from "src/entities/message";

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(ChannelMessage.name)
    private readonly messageModel: Model<ChannelMessage>,
    private readonly serversService: ServersService,
    private readonly socketIoService: SocketIoService
  ) {}

  async createGroup(userId: string, serverId: string, name: string) {
    const server = await this.serversService.getById(userId, serverId);
    const lastGroupOrder = getMaxOrder(server.groups);

    const newGroup = {
      name,
      serverId,
      order: lastGroupOrder == -1 ? 0 : lastGroupOrder + 1,
      channels: [],
    };
    const length = server.groups.push(newGroup);
    await server.save();

    const newGroupDto = Group.toDTO(server.groups[length - 1] as GroupDocument, serverId);
    this.socketIoService.newGroup(serverId, newGroupDto);
  }

  async getById(userId: string, serverId: string, groupId: string) {
    const server = await this.serversService.getById(userId, serverId);
    const group = server.groups.find((group) => group._id.toString() === groupId);
    if (group === undefined) throw new GroupNotFoundException();
    return group as GroupDocument;
  }

  async updateGroup(userId: string, serverId: string, groupId: string, groupUpdate: UpdateGroupRequest) {
    const group = await this.getById(userId, serverId, groupId);
    const server = group.$parent() as ServerDocument;

    let isGroupModified = false;

    if (groupUpdate.name !== undefined) {
      isGroupModified = true;
      group.name = groupUpdate.name;
    }

    let groups;

    if (groupUpdate.order !== undefined) {
      isGroupModified = true;
      const sortedGroups = changeDocumentOrder(server.groups as GroupDocument[], groupId, groupUpdate.order);
      server.groups = sortedGroups;

      groups = sortedGroups.map((group) => ({
        id: group.id,
        order: group.order,
      }));
    }

    if (isGroupModified) {
      await server.save();
    }

    return { name: groupUpdate.name, groups };
  }

  async deleteGroup(userId: string, serverId: string, groupId: string) {
    const group = await this.getById(userId, serverId, groupId);
    const server = group.$parent() as ServerDocument;
    const index = server.groups.findIndex((group) => group._id.toString() === groupId);

    if (group.order === 0) throw new DefaultGroupCannotBeDeletedException();

    const textChannelsIds = group.channels
      .filter((channel) => channel.type === ChannelType.text)
      .map((channel) => ({ channelId: channel._id.toString() }));
    if (textChannelsIds.length > 0) await this.messageModel.deleteMany({ $or: textChannelsIds });

    server.groups.splice(index, 1);
    server.groups = server.groups
      .sort((g1, g2) => g1.order - g2.order)
      .map((group: GroupDocument, i) => ({
        ...group.toObject(),
        order: i,
      }));

    await server.save();

    const groups = server.groups.map((group) => ({
      id: group._id.toString(),
      order: group.order,
    }));

    this.socketIoService.groupDeleted({ serverId, groupId }, groups);
  }
}
