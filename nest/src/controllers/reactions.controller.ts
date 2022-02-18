import { Body, Controller, Delete, Param, Post } from "@nestjs/common";
import { AuthenticatedUser } from "nest-keycloak-connect";
import NewReactionRequest from "../dtos/requests/new-reaction-request";
import KeycloakUser from "../keycloak-user";
import { ReactionsService } from "../services/reactions.service";

@Controller("servers/:serverId/groups/:groupId/channels/:channelId/messages/:messageId/reactions")
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  async createReaction(
    @AuthenticatedUser() user: KeycloakUser,
    @Param("serverId") serverId: string,
    @Param("groupId") groupId: string,
    @Param("channelId") channelId: string,
    @Param("messageId") messageId: string,
    @Body() newReaction: NewReactionRequest
  ) {
    await this.reactionsService.createReaction(user.sub, serverId, groupId, channelId, messageId, newReaction);
  }

  @Delete(":emojiId")
  async deleteEmojis(
    @AuthenticatedUser() user: KeycloakUser,
    @Param("serverId") serverId: string,
    @Param("groupId") groupId: string,
    @Param("channelId") channelId: string,
    @Param("messageId") messageId: string,
    @Param("reactionId") reactionId: string
  ) {
    await this.reactionsService.deleteReaction(user.sub, serverId, groupId, channelId, messageId, reactionId);
  }
}
