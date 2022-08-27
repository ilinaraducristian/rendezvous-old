import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { FriendshipMessageDto } from "../../dtos/message.dto";
import { UserDocument } from "../../entities/user.schema";
import { SseService } from "../../sse.service";
import { ExtractAuthenticatedUser, extractOtherId } from "../../util";
import { FriendshipMessageParams, FriendshipParams, NewFriendshipMessageDto } from "../friendship.dto";
import { FriendshipMessageService } from "./friendship-message.service";

@Controller("friendships/:friendshipId/messages")
export class FriendshipMessageController {
  constructor(
    private readonly friendshipMessageService: FriendshipMessageService,
    private readonly sseService: SseService
  ) { }

  @Post()
  async createFriendshipMessage(
    @ExtractAuthenticatedUser() user: UserDocument,
    @Param() { friendshipId }: FriendshipParams,
    @Body() { text }: NewFriendshipMessageDto
  ): Promise<FriendshipMessageDto> {
    const friendshipMessage = await this.friendshipMessageService.createFriendshipMessage(user, friendshipId, text);
    const friendshipMessageDto = new FriendshipMessageDto(friendshipMessage);
    const otherId = extractOtherId(user, friendshipMessage.friendship);
    this.sseService.friendshipMessage(otherId, friendshipMessageDto);
    return friendshipMessageDto;
  }

  @Get()
  async getFriendshipMessages(
    @ExtractAuthenticatedUser() user: UserDocument,
    @Param() { friendshipId }: FriendshipParams,
    @Query("offset") offset = 0,
    @Query("limit") limit = 100
  ): Promise<FriendshipMessageDto[]> {
    const friendshipMessages = await this.friendshipMessageService.getFriendshipMessages(user, friendshipId, offset, limit);
    return friendshipMessages.map((message) => new FriendshipMessageDto(message)).reverse();
  }

  // @Get(':friendshipId/messages/:id')
  // async getFriendshipMessage(@ExtractAuthenticatedUser() user: UserDocument, @Param("friendshipId") friendshipId: string, @Param("id") id: string) {
  //   return this.friendshipMessageService.getFriendshipMessage(user, friendshipId, id);
  // }

  @Delete(":messageId")
  async deleteFriendshipMessage(
    @ExtractAuthenticatedUser() user: UserDocument,
    @Param() { friendshipId, messageId }: FriendshipMessageParams,
  ): Promise<void> {
    const message = await this.friendshipMessageService.deleteFriendshipMessage(user, friendshipId, messageId);
    const otherId = extractOtherId(user, message.friendship);
    this.sseService.deleteFriendshipMessage(otherId, friendshipId, messageId);
  }

  @Delete()
  async deleteFriendshipMessages(
    @ExtractAuthenticatedUser() user: UserDocument,
    @Param() { friendshipId }: FriendshipParams
  ): Promise<void> {
    await this.friendshipMessageService.deleteFriendshipMessages(user, friendshipId);
  }
}
