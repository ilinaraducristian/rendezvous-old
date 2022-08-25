import { Controller, Get } from "@nestjs/common";
import { MessageDto } from "../dtos/message.dto";
import { ConversationsDto } from "../dtos/user-dtos";
import { UserDocument } from "../entities/user.schema";
import { ExtractAuthenticatedUser } from "../util";
import { ConversationService } from "./conversation.service";


@Controller("conversations")
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) { }

  @Get()
  async getConversations(@ExtractAuthenticatedUser() user: UserDocument): Promise<ConversationsDto> {
    const conversations = await this.conversationService.getConversations(user);
    return conversations.map(conversation => new MessageDto(conversation));
  }

}
