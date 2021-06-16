import { Controller } from "@nestjs/common";
import { AppService } from "../app.service";
import { Server } from "socket.io";
import { WebSocketServer } from "@nestjs/websockets";

@Controller("messages")
export class MessagesController {

  @WebSocketServer()
  server: Server;

  constructor(private readonly appService: AppService) {
  }

}
