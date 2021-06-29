import { Body, Controller, Get, Post } from "@nestjs/common";
import { AppService } from "../../app.service";
import { AuthenticatedUser } from "nest-keycloak-connect";
import { Server as IOServer } from "socket.io";
import { WebSocketServer } from "@nestjs/websockets";
import { KeycloakUser, UserServersData } from "../../types";

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

