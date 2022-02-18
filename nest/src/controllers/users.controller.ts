import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { AuthenticatedUser } from "nest-keycloak-connect";
import Friendship from "src/entities/friendship";
import Server from "src/entities/server";
import { FriendshipsService } from "src/services/friendships.service";
import { KeycloakAdminService } from "src/services/keycloak-admin.service";
import JoinServerRequest from "../dtos/requests/join-server-request";
import KeycloakUser from "../keycloak-user";
import { ServersService } from "../services/servers.service";
import { UsersService } from "../services/users.service";

@Controller("users")
export class UsersController {
  constructor(
    private readonly membersService: UsersService,
    private readonly friendshipsService: FriendshipsService,
    private readonly serversService: ServersService,
    private readonly keycloakAdminService: KeycloakAdminService
  ) {}

  @Get(":userId/profile")
  async getUserProfile(@AuthenticatedUser() user: KeycloakUser, @Param("userId") userId: string) {
    const [areFriends, haveServersInCommon] = await Promise.all([
      this.friendshipsService.areFriends(userId, user.sub),
      this.membersService.haveServersInCommon(user.sub, userId),
    ]);
    if (!areFriends || !haveServersInCommon) return undefined;
    const kcUser = await this.keycloakAdminService.getUser(userId);
    if (kcUser === undefined) return undefined;
    return {
      username: kcUser.username as string,
      email: kcUser.email as string,
      firstName: kcUser.firstName as string,
      lastName: kcUser.lastName as string,
    };
  }

  @Post("servers")
  async joinServer(@AuthenticatedUser() user: KeycloakUser, @Body() joinServerRequest: JoinServerRequest) {
    return this.serversService.createMember(user.sub, joinServerRequest.invitation);
  }

  @Get("servers")
  async getServers(@AuthenticatedUser() user: KeycloakUser) {
    return (await this.membersService.getServers(user.sub)).map((server) => Server.toDTO(server));
  }

  @Get("data")
  async getData(@AuthenticatedUser() user: KeycloakUser) {
    const [friendships, servers] = await Promise.all([this.friendshipsService.getAllByUserId(user.sub), this.membersService.getServers(user.sub)]);
    return {
      friendships: friendships.map((friendship) => Friendship.toDTO(friendship)),
      servers: servers.map((server) => Server.toDTO(server)),
    };
  }

  @Put("servers/:serverId")
  async changeServerOrder(@AuthenticatedUser() user: KeycloakUser, @Body() { order }: { order: number }) {
    // TODO implementation
  }

  @Delete("servers/:serverId")
  async leaveServer(@AuthenticatedUser() user: KeycloakUser, @Param("serverId") serverId: string) {
    await this.serversService.deleteMember(user.sub, serverId);
  }
}
