import { Body, Controller, Post } from "@nestjs/common";
import { AppService } from "../app.service";
import { Server } from "socket.io";
import { AuthenticatedUser } from "nest-keycloak-connect";
import { WebSocketServer } from "@nestjs/websockets";

@Controller("messages")
export class MessagesController {

  @WebSocketServer()
  server: Server;

  constructor(private readonly appService: AppService) {
  }

  @Post()
  async sendMessage(
    @AuthenticatedUser() user: any,
    @Body() message: any
  ) {
    const result = await this.appService.sendMessage(message.channel_id, message.text, user.sub);
    this.server.to(`server_${result.server_id}`).emit("message_received", {
      id: result.message_id,
      channel_id: message.channel_id,
      server_id: result.server_id,
      timestamp: result.timestamp,
      sender: user.sub,
      text: message.text
    });
  }

}
