import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from "@nestjs/common";
import { ConversationDto, FriendshipDto } from "../entities/dtos";
import { UserDocument } from "../entities/user.schema";
import { ExtractAuthenticatedUser } from "../util";
import { FriendshipService } from "./friendship.service";

@Controller("friendships")
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) { }

  @Post()
  createFriendship(@ExtractAuthenticatedUser() user: UserDocument, @Body() { id }: { id: string }): Promise<FriendshipDto> {
    return this.friendshipService.createFriendship(user, id);
  }

  @Get()
  getFriendships(@ExtractAuthenticatedUser() user: UserDocument): Promise<FriendshipDto[]> {
    return this.friendshipService.getFriendships(user);
  }

  @Patch(":id/accept")
  @HttpCode(204)
  acceptFriendship(@ExtractAuthenticatedUser() user: UserDocument, @Param("id") id: string): Promise<void> {
    return this.friendshipService.acceptFriendshipRequest(user, id);
  }

  @Delete(":id")
  @HttpCode(204)
  deleteFriendship(@ExtractAuthenticatedUser() user: UserDocument, @Param("id") id: string): Promise<void> {
    return this.friendshipService.deleteFriendship(user, id);
  }

  @Post(":id/messages")
  createFriendshipMessage(@ExtractAuthenticatedUser() user: UserDocument, @Param("id") id: string, @Body() body: { text: string }): Promise<ConversationDto> {
    return this.friendshipService.createFriendshipMessage(user, id, body.text);
  }

  @Get(':id/messages')
  getFriendshipMessages(@ExtractAuthenticatedUser() user: UserDocument, @Param("id") id: string, @Query("offset") offset: number = 0, @Query("limit") limit: number = 100): Promise<ConversationDto[]> {
    return this.friendshipService.getFriendshipMessages(user, id, offset, limit);
  }

  @Get(':id/messages/:messageId')
  async getFriendshipMessage(@ExtractAuthenticatedUser() user: UserDocument, @Param("id") id: string, @Param("messageId") messageId: string) {
    return this.friendshipService.getFriendshipMessage(user, id, messageId);
  }

  @Delete(":id/messages/:messageId")
  async deleteFriendshipMessage(@ExtractAuthenticatedUser() user: UserDocument, @Param("id") id: string, @Param("messageId") messageId: string) {
    return this.friendshipService.deleteFriendshipMessage(user, id, messageId);
  }

  @Delete(":id/messages")
  async deleteFriendshipMessages(@ExtractAuthenticatedUser() user: UserDocument, @Param("id") id: string) {
    return this.friendshipService.deleteFriendshipMessages(user, id);
  }

}
