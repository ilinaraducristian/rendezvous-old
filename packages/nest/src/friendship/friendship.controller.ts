import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from "@nestjs/common";
import { FriendshipDto } from "../entities/user-data.dto";
import { UserDocument } from "../entities/user.schema";
import { ExtractAuthenticatedUser } from "../util";
import FriendshipMessagesDto from "./entities/friendship-messages.dto";
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
  async createFriendshipMessage(@ExtractAuthenticatedUser() user: UserDocument, @Param("id") id: string, @Body() body: { text: string }) {
    const newFriendshipMessage = await this.friendshipService.createFriendshipMessage(user, id, body.text);
    return {
      id: newFriendshipMessage._id
    };
  }

  // @Get(':id/messages')
  // async getFriendshipMessages(@ExtractAuthenticatedUser() user: UserDocument, @Param("id") id: string, @Query("offset") offset: number = 0, @Query("limit") limit: number = 100): Promise<FriendshipMessagesDto> {
  //   const messages = await this.friendshipService.getFriendshipMessages(user, id, offset, limit);
  //   return {
  //     messages: messages.map(({ id, friendshipId,
  //       userId,
  //       timestamp,
  //       text }) => ({
  //         id,
  //         friendshipId,
  //         userId,
  //         timestamp: timestamp.toISOString(),
  //         text
  //       }))
  //   }
  // }

  @Get(':id/messages/:messageId')
  async getFriendshipMessage(@ExtractAuthenticatedUser() user: UserDocument, @Param("id") id: string, @Param("messageId") messageId: string) {
    return this.friendshipService.getFriendshipMessage(user, id, messageId);
  }

  @Delete(":id/messages/:messageId")
  async deleteFriendshipMessage(@ExtractAuthenticatedUser() user: UserDocument, @Param("id") id: string, @Param("messageId") messageId: string) {
    return this.friendshipService.deleteFriendshipMessage(user, id, messageId);
  }

}
