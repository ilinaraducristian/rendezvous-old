import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { AuthenticatedUser } from "nest-keycloak-connect";
import NewMessageRequest from "../dtos/requests/new-message-request";
import KeycloakUser from "../keycloak-user";
import { ChannelMessagesService } from "../services/channel-messages.service";

@Controller("servers/:serverId/groups/:groupId/channels/:channelId/messages")
export class ChannelMessagesController {
  constructor(private readonly messagesService: ChannelMessagesService) {}

  @Post()
  async createMessage(
    @AuthenticatedUser() user: KeycloakUser,
    @Param("serverId") serverId: string,
    @Param("groupId") groupId: string,
    @Param("channelId") channelId: string,
    @Body() newMessage: NewMessageRequest
  ) {
    await this.messagesService.createMessage(user.sub, serverId, groupId, channelId, newMessage.text, newMessage.files);
  }

  @Get()
  async getMessages(
    @AuthenticatedUser() user: KeycloakUser,
    @Param("serverId") serverId: string,
    @Param("groupId") groupId: string,
    @Param("channelId") channelId: string,
    @Query("offset") offset: number = 0
  ) {
    return await this.messagesService.getMessages(user.sub, serverId, groupId, channelId, offset);
  }

  @Delete(":messageId")
  async deleteMessage(
    @AuthenticatedUser() user: KeycloakUser,
    @Param("serverId") serverId: string,
    @Param("groupId") groupId: string,
    @Param("channelId") channelId: string,
    @Param("messageId") messageId: string
  ) {
    await this.messagesService.deleteMessage(user.sub, serverId, groupId, channelId, messageId);
  }
}
