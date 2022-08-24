import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from "@nestjs/common";
import { NewFriendshipDto } from "../dtos/friendship.dto";
import { FriendshipMessageDto } from "../dtos/message.dto";
import { FriendshipDto } from "../dtos/user-dtos";
import { UserDocument } from "../entities/user.schema";
import { ExtractAuthenticatedUser } from "../util";
import { FriendshipService } from "./friendship.service";

@Controller("friendships")
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) { }

  @Post()
  createFriendship(@ExtractAuthenticatedUser() user: UserDocument, @Body() { id }: NewFriendshipDto): Promise<FriendshipDto> {
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
  createFriendshipMessage(@ExtractAuthenticatedUser() user: UserDocument, @Param("id") id: string, @Body() body: { text: string }): Promise<FriendshipMessageDto> {
    return this.friendshipService.createFriendshipMessage(user, id, body.text);
  }

  @Get(':id/messages')
  getFriendshipMessages(@ExtractAuthenticatedUser() user: UserDocument, @Param("id") id: string, @Query("offset") offset: number = 0, @Query("limit") limit: number = 100): Promise<FriendshipMessageDto[]> {
    return this.friendshipService.getFriendshipMessages(user, id, offset, limit);
  }

  @Get(':friendshipId/messages/:id')
  async getFriendshipMessage(@ExtractAuthenticatedUser() user: UserDocument, @Param("friendshipId") friendshipId: string, @Param("id") id: string) {
    return this.friendshipService.getFriendshipMessage(user, friendshipId, id);
  }

  @Delete(":friendshipId/messages/:id")
  async deleteFriendshipMessage(@ExtractAuthenticatedUser() user: UserDocument, @Param("friendshipId") friendshipId: string, @Param("id") id: string) {
    return this.friendshipService.deleteFriendshipMessage(user, friendshipId, id);
  }

  @Delete(":id/messages")
  async deleteFriendshipMessages(@ExtractAuthenticatedUser() user: UserDocument, @Param("id") id: string) {
    return this.friendshipService.deleteFriendshipMessages(user, id);
  }

}
