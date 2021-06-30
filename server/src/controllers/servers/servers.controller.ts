import { Body, Controller, Get, Post } from "@nestjs/common";
import { AppService } from "../../app.service";
import { AuthenticatedUser } from "nest-keycloak-connect";
import { KeycloakUser, UserServersData } from "../../types";

export type NewServerRequest = {
  name: string,
  order: number
}

@Controller("servers")
export class ServersController {

  constructor(private readonly appService: AppService) {
  }

  @Get()
  async getUserServersData(
    @AuthenticatedUser() user: KeycloakUser
  ): Promise<UserServersData> {
    return await this.appService.getUserServersData(user.sub);
  }

  @Post()
  async createServer(
    @AuthenticatedUser() user: any,
    @Body("name") name: string
  ): Promise<any> {
    return this.appService.createServer(user.sub, name);
  }

}

