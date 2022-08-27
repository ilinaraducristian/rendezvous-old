import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from "@nestjs/common";
import { UserDocument } from "../entities/user.schema";
import { SseService } from "../sse.service";
import { ExtractAuthenticatedUser, extractOtherId } from "../util";
import { FriendshipDto, FriendshipParams } from "./friendship.dto";
import { FriendshipService } from "./friendship.service";

@Controller("friendships")
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService, private readonly sseService: SseService) {}

  @Post()
  async createFriendship(@ExtractAuthenticatedUser() user: UserDocument, @Body() { friendshipId }: FriendshipParams): Promise<FriendshipDto> {
    const friendship = await this.friendshipService.createFriendship(user, friendshipId);
    const otherId = extractOtherId(user, friendship);
    this.sseService.friendRequest(otherId, new FriendshipDto(user._id, friendship));
    return new FriendshipDto(otherId, friendship);
  }

  @Get()
  async getFriendships(@ExtractAuthenticatedUser() user: UserDocument): Promise<FriendshipDto[]> {
    const friendships = await this.friendshipService.getFriendships(user);
    return friendships.map((friendshipDocument) => {
      const otherId = extractOtherId(user, friendshipDocument);
      return new FriendshipDto(otherId, friendshipDocument);
    });
  }

  @Patch(":friendshipId/accept")
  @HttpCode(204)
  async acceptFriendship(@ExtractAuthenticatedUser() user: UserDocument, @Param() { friendshipId }: FriendshipParams): Promise<void> {
    const friendship = await this.friendshipService.acceptFriendshipRequest(user, friendshipId);
    const otherId = extractOtherId(user, friendship);
    this.sseService.acceptFriendshipRequest(otherId, friendshipId);
  }

  @Delete(":friendshipId")
  @HttpCode(204)
  async deleteFriendship(@ExtractAuthenticatedUser() user: UserDocument, @Param() { friendshipId }: FriendshipParams): Promise<void> {
    const friendship = await this.friendshipService.deleteFriendship(user, friendshipId);
    const otherId = extractOtherId(user, friendship);
    this.sseService.deleteFriendship(otherId, friendshipId);
  }
}
