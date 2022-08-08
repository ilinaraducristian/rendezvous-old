import { Controller, Get} from "@nestjs/common";
import { AuthenticatedUser } from "../types";
import { ExtractAuthenticatedUser } from "../util";
import { ConversationService } from "./conversation.service";


@Controller("conversations")
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) { }

  @Get()
  getConversations(@ExtractAuthenticatedUser() user: AuthenticatedUser) {
    return this.conversationService.getConversations(user.id);
  }

}
