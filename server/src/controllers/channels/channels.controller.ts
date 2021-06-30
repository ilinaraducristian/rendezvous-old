import { Controller, Get, Param, Query } from "@nestjs/common";
import { AppService } from "../../app.service";
import { AuthenticatedUser } from "nest-keycloak-connect";
import { KeycloakUser } from "../../types";

@Controller("channels")
export class ChannelsController {

  constructor(private readonly appService: AppService) {
  }


  @Get(":id/messages")
  async getMessages(
    @AuthenticatedUser() user: KeycloakUser,
    @Param("id") id: number,
    @Query("offset") offset: number
  ) {
    return this.appService.getMessages(user.sub, id, offset);
  }

}
