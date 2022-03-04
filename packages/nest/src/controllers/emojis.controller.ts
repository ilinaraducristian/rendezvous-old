import { Body, Controller, Delete, Param, Post, Put } from "@nestjs/common";
import { AuthenticatedUser } from "nest-keycloak-connect";
import NewEmojisRequest from "src/requests/new-emojis-request";
import UpdateEmojiRequest from "src/requests/update-emoji-request";
import KeycloakUser from "../keycloak-user";
import { EmojisService } from "../services/emojis.service";

@Controller("servers/:serverId/emojis")
export class EmojisController {
  constructor(private readonly emojisService: EmojisService) {}

  @Post()
  async createEmojis(@AuthenticatedUser() user: KeycloakUser, @Param("serverId") serverId: string, @Body() { emojis }: NewEmojisRequest) {
    await this.emojisService.createEmojis(user.sub, serverId, emojis);
  }

  @Put(":emojiId")
  async updateEmoji(
    @AuthenticatedUser() user: KeycloakUser,
    @Param("serverId") serverId: string,
    @Param("emojiId") emojiId: string,
    @Body() emojiUpdate: UpdateEmojiRequest
  ) {
    await this.emojisService.updateEmoji(user.sub, serverId, emojiId, emojiUpdate);
  }

  @Delete(":emojiId")
  async deleteEmojis(@AuthenticatedUser() user: KeycloakUser, @Param("serverId") serverId: string, @Param("emojiId") emojiId: string) {
    await this.emojisService.deleteEmoji(user.sub, serverId, emojiId);
  }
}
