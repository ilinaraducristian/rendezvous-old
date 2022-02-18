import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ChannelType } from "../dtos/channel";
import UpdateChannelRequest from "../dtos/requests/update-channel-request";
import Channel, { ChannelDocument } from "../entities/channel";
import { GroupDocument } from "../entities/group";
import { ServerDocument } from "../entities/server";
import { ChannelNotFoundException } from "../exceptions/NotFoundExceptions";
import { GroupsService } from "./groups.service";
import { SocketIoService } from "./socket-io.service";
import { changeDocumentOrder, getMaxOrder, sortDocuments } from "../util";
import { ChannelMessage } from "src/entities/message";

@Injectable()
export class ChannelsService {
  constructor(
    @InjectModel(ChannelMessage.name)
    private readonly messageModel: Model<ChannelMessage>,
    private readonly groupsService: GroupsService,
    private readonly socketIoService: SocketIoService
  ) {}

  async createChannel(userId: string, serverId: string, groupId: string, newChannelRequest: Pick<Channel, "name" | "type">) {
    const group = await this.groupsService.getById(userId, serverId, groupId);
    const server = group.$parent() as ServerDocument;
    const lastChannelOrder = getMaxOrder(group.channels);

    const newChannel = {
      name: newChannelRequest.name,
      serverId,
      groupId,
      type: newChannelRequest.type,
      order: lastChannelOrder + 1,
    };

    const length = group.channels.push(newChannel);
    await server.save();

    const newChannelDto = Channel.toDTO(group.channels[length - 1] as ChannelDocument, serverId, groupId);
    this.socketIoService.newChannel({ serverId, groupId }, newChannelDto);
  }

  async getById(userId: string, serverId: string, groupId: string, channelId: string) {
    return this.getByIdAndType(userId, serverId, groupId, channelId);
  }

  async getByIdAndType(userId: string, serverId: string, groupId: string, channelId: string, type?: ChannelType) {
    const group = await this.groupsService.getById(userId, serverId, groupId);
    const channel = group.channels.find((channel) => channel._id.toString() === channelId);
    if (channel === undefined) throw new ChannelNotFoundException();
    if (type !== undefined && channel.type !== type) throw new ChannelNotFoundException();
    return channel as ChannelDocument;
  }

  async updateChannel(userId: string, serverId: string, groupId: string, channelId: string, channelUpdate: UpdateChannelRequest) {
    const channel = await this.getByIdAndType(userId, serverId, groupId, channelId);

    const group1 = channel.$parent() as GroupDocument;
    const group2 = await this.groupsService.getById(userId, serverId, channelUpdate.groupId);

    const server = group1.$parent() as ServerDocument;

    let isChannelModified = false;

    if (channelUpdate.name !== undefined) {
      isChannelModified = true;
      channel.name = channelUpdate.name;
    }

    let channels;

    if (channelUpdate.order !== undefined) {
      isChannelModified = true;
      if (groupId === channelUpdate.groupId) {
        channels = group1.channels = changeDocumentOrder(group1.channels as ChannelDocument[], channelId, channelUpdate.order);
      } else {
        const sortedChannels1 = sortDocuments(group1.channels as ChannelDocument[]);
        const sortedChannels2 = sortDocuments(group2.channels as ChannelDocument[]);
        const index1 = sortedChannels1.findIndex((channel) => channel._id.toString() === channelId);
        sortedChannels2.splice(channelUpdate.order, 0, sortedChannels1.splice(index1, 1)[0]);
        group1.channels = sortedChannels1;
        group2.channels = sortedChannels2;
        channels = group1.channels.concat(group2.channels);
      }
      channels = channels.map((channel) => ({
        id: channel.id,
        groupId: channel.groupId,
        order: channel.order,
      }));
    }

    if (isChannelModified) {
      await server.save();
    }

    return { name: channelUpdate.name, channels };
  }

  async deleteChannel(userId: string, serverId: string, groupId: string, channelId: string) {
    const channel = await this.getByIdAndType(userId, serverId, groupId, channelId);

    const group = channel.$parent() as GroupDocument;
    const server = group.$parent() as ServerDocument;

    const index = group.channels.findIndex((channel) => channel._id.toString() === channelId);

    await this.messageModel.deleteMany({ channelId });

    group.channels.splice(index, 1);
    group.channels = sortDocuments(group.channels as ChannelDocument[]);
    await server.save();

    const channels = group.channels.map((channel) => ({
      id: channel._id.toString(),
      order: channel.order,
    }));

    this.socketIoService.channelDeleted({ serverId, groupId, channelId }, channels);
  }
}
