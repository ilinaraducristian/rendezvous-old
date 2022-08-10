import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { UserDocument } from "../entities/user.schema";
import { ExtractAuthenticatedUser } from "../util";
import FriendshipMessagesDto from "./entities/friendship-messages.dto";
import { FriendshipService } from "./friendship.service";

@Controller("friendships")
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) { }

  @Post()
  async createFriendship(@ExtractAuthenticatedUser() user: UserDocument, @Body() { friendUserId }: { friendUserId: string }) {
    const newFriendship = await this.friendshipService.createFriendship(user, friendUserId);
    return {
      id: newFriendship.id
    }
  }

  @Get()
  async getFriendships(@ExtractAuthenticatedUser() user: UserDocument) {
    return this.friendshipService.getFriendships(user);
  }

  @Patch(":id/accept")
  @HttpCode(204)
  async acceptFriendship(@ExtractAuthenticatedUser() user: UserDocument, @Param("id") id: string) {
    await this.friendshipService.acceptFriendshipRequest(user, id);
  }

  @Delete(":id")
  @HttpCode(204)
  async deleteFriendship(@ExtractAuthenticatedUser() user: UserDocument, @Param("id") id: string) {
    await this.friendshipService.deleteFriendship(user, id);
  }

  @Post(":id/messages")
  async createFriendshipMessage(@ExtractAuthenticatedUser() user: UserDocument, @Param("id") id: string, @Body() body: { text: string }) {
    const newFriendshipMessage = await this.friendshipService.createFriendshipMessage(user, id, body.text);
    return {
      id: newFriendshipMessage._id
    };
  }

  @Get(':id/messages')
  async getFriendshipMessages(@ExtractAuthenticatedUser() user: UserDocument, @Param("id") id: string, @Query("offset") offset: number = 0, @Query("limit") limit: number = 100): Promise<FriendshipMessagesDto> {
    const messages = await this.friendshipService.getFriendshipMessages(user, id, offset, limit);
    return {
      messages: messages.map(({ id, friendshipId,
        userId,
        timestamp,
        text }) => ({
          id,
          friendshipId,
          userId,
          timestamp: timestamp.toISOString(),
          text
        }))
    }
  }

  @Get(':id/messages/:messageId')
  async getFriendshipMessage(@ExtractAuthenticatedUser() user: UserDocument, @Param("id") id: string, @Param("messageId") messageId: string) {
    return this.friendshipService.getFriendshipMessage(user, id, messageId);
  }

  @Delete(":id/messages/:messageId")
  async deleteFriendshipMessage(@ExtractAuthenticatedUser() user: UserDocument, @Param("id") id: string, @Param("messageId") messageId: string) {
    return this.friendshipService.deleteFriendshipMessage(user, id, messageId);
  }

}
