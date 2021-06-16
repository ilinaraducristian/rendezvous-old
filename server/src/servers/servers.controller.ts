import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AppService } from "../app.service";
import { AuthenticatedUser } from "nest-keycloak-connect";
import { Server as IOServer } from "socket.io";
import { WebSocketServer } from "@nestjs/websockets";
import NewServerResponse from "../models/NewServer";

export type NewServerRequest = {
  name: string,
  order: number
}

@Controller("servers")
export class ServersController {

  @WebSocketServer()
  server: IOServer;

  constructor(private readonly appService: AppService) {
  }

  @Post()
  async createServer(
    @AuthenticatedUser() user: any,
    @Body("name") name: string,
    @Body("order") order: number
  ): Promise<NewServerResponse> {
    return this.appService.createServer(user.sub, name, order);
  }

  @Get()
  async getServers(
    @AuthenticatedUser() user: KeycloakUser
  ): Promise<UserServersData> {
    return await this.appService.getUserServersData(user.sub);
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
    // this.server.sockets.sockets.get(socket.socket_id).join(`server_${result.server_id}`);
    // return result;
    return "";
  }

}

export type KeycloakUser = {
  sub: string,
  preferred_username: string,
  email: string, name: string,
  nickname: string,
  given_name: string,
  family_name: string
}

export type User = {
  id: string,
  username: string,
  firstName: string,
  lastName: string
}

export type Server = {
  id: number,
  name: string,
  user_id: string,
  order: number
}

export type Channel = {
  id: number,
  server_id: number,
  group_id: number,
  type: string,
  name: string,
  order: number
}

export type Group = {
  id: number,
  server_id: number,
  name: string,
  order: number
}

export type Message = {
  id: number,
  channel_id: number,
  user_id: string,
  timestamp: string,
  text: string,
}

export type Member = {
  id: number,
  server_id: number,
  user_id: string
}

export type UserServersData = {
  users: User[],
  servers: Server[],
  channels: Channel[],
  groups: Group[],
  messages: Message[],
  members: Member[]
}