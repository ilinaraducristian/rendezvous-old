import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { GroupMessageDto } from "../../dtos/message.dto";
import { UserDocument } from "../../entities/user.schema";
import { SseService } from "../../sse.service";
import { ExtractAuthenticatedUser } from "../../util";
import { GroupParams } from "../group.dto";
import { GroupMessageService } from "./group-message.service";

@Controller("groups/:groupId/messages")
export class GroupMessageController {
  constructor(private readonly groupMessageService: GroupMessageService, private readonly sseService: SseService) {}

  @Post()
  async createGroupMessage(
    @ExtractAuthenticatedUser() user: UserDocument,
    @Param() { groupId }: GroupParams,
    @Body() body: { text: string }
  ): Promise<GroupMessageDto> {
    const message = await this.groupMessageService.createGroupMessage(user, groupId, body.text);
    const messageDto = new GroupMessageDto(message);
    this.sseService.groupMessage(message.groupId, messageDto);
    return messageDto;
  }

  @Get()
  async getGroupMessages(
    @ExtractAuthenticatedUser() user: UserDocument,
    @Param() { groupId }: GroupParams,
    @Query("offset") offset = 0,
    @Query("limit") limit = 100
  ): Promise<GroupMessageDto[]> {
    const messages = await this.groupMessageService.getGroupMessages(user, groupId, offset, limit);
    return messages.map((message) => new GroupMessageDto(message)).reverse();
  }
}
