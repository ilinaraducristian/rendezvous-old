import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AppService } from "../app.service";
import { AuthenticatedUser } from "nest-keycloak-connect";
import { Server } from "socket.io";

@Controller("servers")
export class ServersController {

  constructor(private readonly appService: AppService, private readonly server: Server) {
  }

  @Post()
  async createServer(
    @AuthenticatedUser() user: any,
    @Body() server: any
  ): Promise<number> {
    return this.appService.createServer(user.sub, server.name);
  }

  @Get(":id")
  async getServer(
    @AuthenticatedUser() user: any,
    @Param("id") sid: number
  ): Promise<string> {
    return this.appService.getServerData(sid, user.sub);
  }

  @Get()
  async getServers(
    @AuthenticatedUser() user: any
  ): Promise<string> {
    return this.appService.getServersData(user.sub);
  }

  @Post(":id/invitations")
  async createInvitation(
    @AuthenticatedUser() user: any,
    @Param("id") sid: number
  ): Promise<string> {
    return this.appService.createInvitation(sid, user.sub);
  }

  @Post(":id/invitations/:invitation")
  async joinServer(
    @AuthenticatedUser() user: any,
    @Param("invitation") invitation: string,
    @Body() socket: any
  ): Promise<string> {
    const result = await this.appService.joinServer(invitation, user.sub);
    this.server.sockets.sockets.get(socket.socket_id).join(`server_${result.server_id}`)
    return result;
  }

}
