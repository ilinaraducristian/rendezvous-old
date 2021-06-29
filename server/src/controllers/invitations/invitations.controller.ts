import { Body, Controller, Param, Post } from "@nestjs/common";
import { AuthenticatedUser } from "nest-keycloak-connect";
import { KeycloakUser } from "../../types";
import { AppService } from "../../app.service";

@Controller("invitations")
export class InvitationsController {

  constructor(private readonly appService: AppService) {
  }

  @Post()
  async createInvitation(
    @AuthenticatedUser() user: KeycloakUser,
    @Body("serverId") serverId: number
  ) {
    console.log(serverId);
    console.log(user.sub);
    return { invitation: await this.appService.createInvitation(user.sub, serverId) };
  }

  @Post(":invitation")
  async joinServer(
    @AuthenticatedUser() user: KeycloakUser,
    @Param("invitation") invitation: string
  ) {
    console.log(user.sub);
    return this.appService.joinServer(user.sub, invitation);
  }

}
