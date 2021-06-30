import { Body, Controller, Param, Post } from "@nestjs/common";
import { AuthenticatedUser } from "nest-keycloak-connect";
import { KeycloakUser } from "../../types";
import { AppService } from "../../app.service";
import { WebSocketServer } from "@nestjs/websockets";
import { Server as IOServer } from "socket.io";

@Controller("invitations")
export class InvitationsController {

  @WebSocketServer()
  server: IOServer;

  constructor(private readonly appService: AppService) {
  }

  @Post()
  async createInvitation(
    @AuthenticatedUser() user: KeycloakUser,
    @Body("serverId") serverId: number
  ) {
    return { invitation: await this.appService.createInvitation(user.sub, serverId) };
  }

  @Post(":invitation")
  async joinServer(
    @AuthenticatedUser() user: KeycloakUser,
    @Param("invitation") invitation: string
  ) {
    return this.appService.joinServer(user.sub, invitation);
  }

}
