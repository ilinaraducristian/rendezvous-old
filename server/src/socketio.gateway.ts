import { OnGatewayConnection, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { AppService } from "./app.service";

@WebSocketGateway()
export class SocketIOGateway implements OnGatewayConnection<Socket> {

  constructor(private readonly appService: AppService) {
  }

  // @SubscribeMessage("message")
  // handleMessage(client: any, payload: any): string {
  //   return "Hello world!";
  // }

  async handleConnection(client: Socket, ...args: any[]) {
    const servers = await this.appService.getUserServers(client.handshake.auth.userId);
    servers.forEach(server => {
      client.join(`server_${server.id}`);
    });
  }

}
