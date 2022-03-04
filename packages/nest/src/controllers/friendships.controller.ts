import { Body, Controller, Delete, Param, Post, Put } from "@nestjs/common";
import { AuthenticatedUser } from "nest-keycloak-connect";
import NewFriendshipRequest from "src/requests/new-friendship-request";
import UpdateFriendshipRequest from "src/requests/update-friendship-request";
import KeycloakUser from "../keycloak-user";
import { FriendshipsService } from "../services/friendships.service";

@Controller("friendships")
export class FriendshipsController {
  constructor(private readonly friendshipsService: FriendshipsService) {}

  @Post()
  createFriendship(@AuthenticatedUser() user: KeycloakUser, @Body() newFriendship: NewFriendshipRequest) {
    return this.friendshipsService.createFriendship(user.sub, newFriendship.userId);
  }

  @Put(":friendshipId")
  updateFriendship(
    @AuthenticatedUser() user: KeycloakUser,
    @Param("friendshipId") friendshipId: string,
    @Body() updateFriendshipRequest: UpdateFriendshipRequest
  ) {
    this.friendshipsService.updateFriendship(user.sub, friendshipId, updateFriendshipRequest.status);
  }

  @Delete(":friendshipId")
  deleteFriendship(@AuthenticatedUser() user: KeycloakUser, @Param("friendshipId") id: string) {
    this.friendshipsService.deleteFriendship(user.sub, id);
  }
}
