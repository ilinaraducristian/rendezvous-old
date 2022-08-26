import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { GroupMessageDto } from "../../dtos/message.dto";
import { UserDocument } from "../../entities/user.schema";
import { ObjectIdPipe } from "../../object-id.pipe";
import { SseService } from "../../sse.service";
import { ExtractAuthenticatedUser } from "../../util";
import { GroupMessageService } from "./group-message.service";

@Controller("groups/:groupId")
export class GroupMessageController {
  constructor(private readonly groupMessageService: GroupMessageService, private readonly sseService: SseService) {}

  @Post("messages")
  async createGroupMessage(
    @ExtractAuthenticatedUser() user: UserDocument,
    @Param("groupId", new ObjectIdPipe()) groupId: string,
    @Body() body: { text: string }
  ): Promise<GroupMessageDto> {
    const message = await this.groupMessageService.createGroupMessage(user, groupId, body.text);
    const messageDto = new GroupMessageDto(message);
    this.sseService.groupMessage(message.groupId, messageDto);
    return messageDto;
  }

  @Get("messages")
  async getGroupMessages(
    @ExtractAuthenticatedUser() user: UserDocument,
    @Param("groupId", new ObjectIdPipe()) groupId: string,
    @Query("offset") offset = 0,
    @Query("limit") limit = 100
  ): Promise<GroupMessageDto[]> {
    const messages = await this.groupMessageService.getGroupMessages(user, groupId, offset, limit);
    return messages.map((message) => new GroupMessageDto(message)).reverse();
  }
}
