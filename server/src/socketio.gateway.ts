import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AppService } from "./app.service";

@WebSocketGateway()
export class SocketIOGateway implements OnGatewayConnection<Socket> {

  @WebSocketServer()
  server: Server;

  constructor(private readonly appService: AppService) {
  }

  @SubscribeMessage("send_message")
  handleMessage(client: any, payload: string) {
    this.server.emit("message_received", {
      id: 2,
      channel_id: 3,
      user_id: "97a8ffc2-10cd-47dd-b915-cf8243d5bfc4",
      timestamp: new Date(),
      text: payload
    });
  }

  @SubscribeMessage("create_channel")
  createChannel(client: any, payload: any) {
    this.server.emit("channel_created", {
      id: 4,
      server_id: 1,
      group_id: 1,
      type: "text",
      name: payload,
      order: 1
    });
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const servers = await this.appService.getUserServers(client.handshake.auth.sub);
    servers.forEach(server => {
      client.join(`server_${server.id}`);
    });
  }

}
