import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AppService } from "../app.service";
import { AuthenticatedUser } from "nest-keycloak-connect";
import { Server } from "socket.io";
import { WebSocketServer } from "@nestjs/websockets";
import User from "../User";

@Controller("servers")
export class ServersController {

  @WebSocketServer()
  server: Server;

  constructor(private readonly appService: AppService) {
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
    return this.appService.getServerData(user.sub, sid);
  }

  @Get()
  async getServers(
    @AuthenticatedUser() user: User
  ): Promise<any[]> {
    return this.appService.getServersData(user.sub);
  }

  @Post(":id/invitations")
  async createInvitation(
    @AuthenticatedUser() user: any,
    @Param("id") sid: number
  ): Promise<string> {
    return this.appService.createInvitation(user.sub, sid);
  }

  @Post(":id/invitations/:invitation")
  async joinServer(
    @AuthenticatedUser() user: any,
    @Param("invitation") invitation: string,
    @Body() socket: any
  ): Promise<string> {
    const result = await this.appService.joinServer(user.sub, invitation);
    this.server.sockets.sockets.get(socket.socket_id).join(`server_${result.server_id}`);
    return result;
  }

}
