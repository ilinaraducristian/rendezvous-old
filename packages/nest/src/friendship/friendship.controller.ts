import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from "@nestjs/common";
import { UserDocument } from "../entities/user.schema";
import { ObjectIdPipe } from "../object-id.pipe";
import { ExtractAuthenticatedUser } from "../util";
import { FriendshipDto, NewFriendshipDto } from "./friendship.dto";
import { FriendshipService } from "./friendship.service";

@Controller("friendships")
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) { }

  @Post()
  async createFriendship(@ExtractAuthenticatedUser() user: UserDocument, @Body() { id }: NewFriendshipDto): Promise<FriendshipDto> {
    const friendship = await this.friendshipService.createFriendship(user, id);
    return new FriendshipDto(user, friendship);
  }

  @Get()
  async getFriendships(@ExtractAuthenticatedUser() user: UserDocument): Promise<FriendshipDto[]> {
    const friendships = await this.friendshipService.getFriendships(user);
    return friendships.map(friendshipDocument => new FriendshipDto(user, friendshipDocument));
  }

  @Patch(":id/accept")
  @HttpCode(204)
  async acceptFriendship(@ExtractAuthenticatedUser() user: UserDocument, @Param("id", new ObjectIdPipe()) id: string): Promise<void> {
    await this.friendshipService.acceptFriendshipRequest(user, id);
  }

  @Delete(":id")
  @HttpCode(204)
  async deleteFriendship(@ExtractAuthenticatedUser() user: UserDocument, @Param("id", new ObjectIdPipe()) id: string): Promise<void> {
    await this.friendshipService.deleteFriendship(user, id);
  }

}
