import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { FriendshipMessageDto } from "../../dtos/message.dto";
import { UserDocument } from "../../entities/user.schema";
import { ObjectIdPipe } from "../../object-id.pipe";
import { SseService } from "../../sse.service";
import { ExtractAuthenticatedUser, extractOtherId } from "../../util";
import { NewFriendshipMessageDto } from "../friendship.dto";
import { FriendshipMessageService } from "./friendship-message.service";

@Controller("friendships/:friendshipId")
export class FriendshipMessageController {
  constructor(private readonly friendshipMessageService: FriendshipMessageService, private readonly sseService: SseService) {}

  @Post("messages")
  async createFriendshipMessage(
    @ExtractAuthenticatedUser() user: UserDocument,
    @Param("friendshipId", new ObjectIdPipe()) friendshipId: string,
    @Body() { text }: NewFriendshipMessageDto
  ): Promise<FriendshipMessageDto> {
    const friendshipMessage = await this.friendshipMessageService.createFriendshipMessage(user, friendshipId, text);
    const friendshipMessageDto = new FriendshipMessageDto(friendshipMessage);
    const otherId = extractOtherId(user, friendshipMessage.friendship);
    this.sseService.friendshipMessage(otherId, friendshipMessageDto);
    return friendshipMessageDto;
  }

  @Get("messages")
  async getFriendshipMessages(
    @ExtractAuthenticatedUser() user: UserDocument,
    @Param("friendshipId") friendshipId: string,
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

  @Delete("messages/:id")
  async deleteFriendshipMessage(
    @ExtractAuthenticatedUser() user: UserDocument,
    @Param("friendshipId", new ObjectIdPipe()) friendshipId: string,
    @Param("id", new ObjectIdPipe()) id: string
  ): Promise<void> {
    const message = await this.friendshipMessageService.deleteFriendshipMessage(user, friendshipId, id);
    const otherId = extractOtherId(user, message.friendship);
    this.sseService.deleteFriendshipMessage(otherId, friendshipId, id);
  }

  @Delete("messages")
  async deleteFriendshipMessages(
    @ExtractAuthenticatedUser() user: UserDocument,
    @Param("friendshipId", new ObjectIdPipe()) friendshipId: string
  ): Promise<void> {
    await this.friendshipMessageService.deleteFriendshipMessages(user, friendshipId);
  }
}
