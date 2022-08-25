import { Body, Controller, Param, Post } from "@nestjs/common";
import { FriendshipMessageReactionDto } from "../../../dtos/message.dto";
import { UserDocument } from "../../../entities/user.schema";
import { ObjectIdPipe } from "../../../object-id.pipe";
import { ExtractAuthenticatedUser } from "../../../util";
import { NewFriendshipMessageReactionDto } from "../../friendship.dto";
import { FriendshipMessageReactionService } from "./friendship-message-reaction.service";


@Controller("friendships/:friendshipId/messages/:messageId")
export class FriendshipMessageReactionController {
  constructor(private readonly friendshipMessageService: FriendshipMessageReactionService) { }

  @Post("reactions")
  async createFriendshipMessageReaction(
    @ExtractAuthenticatedUser() user: UserDocument,
    @Param("friendshipId", new ObjectIdPipe()) friendshipId: string,
    @Param('messageId', new ObjectIdPipe()) messageId: string,
    @Body() { text }: NewFriendshipMessageReactionDto
    ): Promise<FriendshipMessageReactionDto> {
    const reaction = await this.friendshipMessageService.createFriendshipMessageReaction(user, friendshipId, messageId, text);
    return new FriendshipMessageReactionDto(reaction, friendshipId, messageId)
  }

}
