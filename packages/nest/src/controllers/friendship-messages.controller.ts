import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { AuthenticatedUser } from "nest-keycloak-connect";
import NewMessageRequest from "src/requests/new-message-request";
import KeycloakUser from "../keycloak-user";
import { FriendshipMessagesService } from "../services/friendship-messages.service";

@Controller("friendships/:friendshipId/messages")
export class FriendshipMessagesController {
  constructor(private readonly messagesService: FriendshipMessagesService) {}

  @Post()
  async createMessage(@AuthenticatedUser() user: KeycloakUser, @Param("friendshipId") friendshipId: string, @Body() newMessage: NewMessageRequest) {
    await this.messagesService.createMessage(user.sub, friendshipId, newMessage.text);
  }

  @Get()
  async getMessages(@AuthenticatedUser() user: KeycloakUser, @Param("friendshipId") friendshipId: string, @Query("offset") offset: string = "0") {
    return await this.messagesService.getMessages(user.sub, friendshipId, parseInt(offset));
  }

  @Delete(":messageId")
  async deleteMessage(@AuthenticatedUser() user: KeycloakUser, @Param("friendshipId") friendshipId: string, @Param("messageId") messageId: string) {
    await this.messagesService.deleteMessage(user.sub, friendshipId, messageId);
  }
}
