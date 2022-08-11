import { Controller, Get } from "@nestjs/common";
import { UserDocument } from "../entities/user.schema";
import { ExtractAuthenticatedUser } from "../util";
import { ConversationService } from "./conversation.service";


@Controller("conversations")
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) { }

  @Get()
  getConversations(@ExtractAuthenticatedUser() user: UserDocument) {
    return this.conversationService.getConversations(user);
  }

}
