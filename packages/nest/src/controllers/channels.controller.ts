import { Body, Controller, Delete, Param, Post, Put } from "@nestjs/common";
import { AuthenticatedUser } from "nest-keycloak-connect";
import NewChannelRequest from "src/requests/new-channel-request";
import UpdateChannelRequest from "src/requests/update-channel-request";
import KeycloakUser from "../keycloak-user";
import { ChannelsService } from "../services/channels.service";

@Controller("servers/:serverId/groups/:groupId/channels")
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  async createChannel(
    @AuthenticatedUser() user: KeycloakUser,
    @Param("serverId") serverId: string,
    @Param("groupId") groupId: string,
    @Body() newChannel: NewChannelRequest
  ) {
    await this.channelsService.createChannel(user.sub, serverId, groupId, newChannel);
  }

  @Put(":channelId")
  async updateChannel(
    @AuthenticatedUser() user: KeycloakUser,
    @Param("serverId") serverId: string,
    @Param("groupId") groupId: string,
    @Param("channelId") channelId: string,
    @Body() updateChannel: UpdateChannelRequest
  ) {
    await this.channelsService.updateChannel(user.sub, serverId, groupId, channelId, updateChannel);
  }

  @Post(":channelId/users")
  async addUserToVoiceChannel(
    @AuthenticatedUser() user: KeycloakUser,
    @Param("serverId") serverId: string,
    @Param("groupId") groupId: string,
    @Param("channelId") channelId: string
  ) {
    await this.channelsService.addUserToVoiceChannel(user.sub, {serverId, groupId, channelId})
  }

  @Delete(":channelId")
  async deleteChannel(
    @AuthenticatedUser() user: KeycloakUser,
    @Param("serverId") serverId: string,
    @Param("groupId") groupId: string,
    @Param("channelId") channelId: string
  ) {
    await this.channelsService.deleteChannel(user.sub, serverId, groupId, channelId);
  }
}
