import { Injectable } from "@nestjs/common";
import Reaction from "../../../entities/reaction.schema";
import { UserDocument } from "../../../entities/user.schema";
import { FriendshipMessageService } from "../friendship-message.service";

@Injectable()
export class FriendshipMessageReactionService {
  constructor(private readonly friendshipMessageService: FriendshipMessageService) {}

  async createFriendshipMessageReaction(user: UserDocument, friendshipId: string, id: string, text: string) {
    const message = await this.friendshipMessageService.getFriendshipMessage(user, friendshipId, id);
    const reaction = new Reaction(user._id, text);
    message.reactions.push(reaction);
    await message.save();
    return reaction;
  }
}
