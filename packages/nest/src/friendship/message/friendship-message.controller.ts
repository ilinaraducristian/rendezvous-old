import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { FriendshipMessageDto } from "../../dtos/message.dto";
import { UserDocument } from "../../entities/user.schema";
import { ObjectIdPipe } from "../../object-id.pipe";
import { ExtractAuthenticatedUser } from "../../util";
import { NewFriendshipMessageDto } from "../friendship.dto";
import { FriendshipMessageService } from "./friendship-message.service";

@Controller("friendships/:friendshipId")
export class FriendshipMessageController {
  constructor(private readonly friendshipMessageService: FriendshipMessageService) { }

  @Post("messages")
  async createFriendshipMessage(
    @ExtractAuthenticatedUser() user: UserDocument,
    @Param("friendshipId", new ObjectIdPipe()) friendshipId: string,
    @Body() { text }: NewFriendshipMessageDto
  ): Promise<FriendshipMessageDto> {
    const friendshipMessage = await this.friendshipMessageService.createFriendshipMessage(user, friendshipId, text);
    return new FriendshipMessageDto(friendshipMessage);
  }

  @Get('messages')
  async getFriendshipMessages(
    @ExtractAuthenticatedUser() user: UserDocument,
    @Param("friendshipId") friendshipId: string,
    @Query("offset") offset: number = 0,
    @Query("limit") limit: number = 100
  ): Promise<FriendshipMessageDto[]> {
    const friendshipMessages = await this.friendshipMessageService.getFriendshipMessages(user, friendshipId, offset, limit);
    return friendshipMessages.map(message => new FriendshipMessageDto(message)).reverse();
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
    await this.friendshipMessageService.deleteFriendshipMessage(user, friendshipId, id);
  }

  @Delete("messages")
  async deleteFriendshipMessages(
    @ExtractAuthenticatedUser() user: UserDocument,
    @Param("friendshipId", new ObjectIdPipe()) friendshipId: string
  ): Promise<void> {
    await this.friendshipMessageService.deleteFriendshipMessages(user, friendshipId);
  }

}
