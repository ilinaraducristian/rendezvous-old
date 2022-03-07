import { Inject } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway } from "@nestjs/websockets";
import { Keycloak } from "keycloak-connect";
import { KEYCLOAK_INSTANCE } from "nest-keycloak-connect";
import { Server as SocketIoServer, Socket } from "socket.io";
import mediasoup from "src/mediasoup";
import { SocketIoService } from "../services/socket-io.service";
import { UsersService } from "../services/users.service";

@WebSocketGateway(3101, { cors: ["*"] })
class SocketIoGateway implements OnGatewayInit<SocketIoServer>, OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket> {
  constructor(
    private readonly membersService: UsersService,
    private readonly socketIoService: SocketIoService,
    @Inject(KEYCLOAK_INSTANCE)
    private keycloak: Keycloak
  ) {}

  afterInit(server: SocketIoServer) {
    this.socketIoService.socketIoServer = server;
  }

  async handleConnection(client: Socket) {
    const access_token = client.handshake.auth.token;
    let userId: string;

    try {
      if (access_token === undefined || access_token === null) {
        throw new Error("Unauthorized");
      }
      const grant = await this.keycloak.grantManager.createGrant({
        access_token,
      });
      const validatedAccessToken = await this.keycloak.grantManager.validateAccessToken(grant.access_token);
      if (validatedAccessToken !== grant.access_token) {
        throw new Error("Unauthorized");
      }
      const user = JSON.parse(Buffer.from(access_token.split(".")[1], "base64").toString());
      userId = client.handshake.auth.userId = user.sub;
    } catch (e) {
      client.disconnect(true);
      return;
    }
    const servers = await this.membersService.getServers(userId);
    client.join(servers.map((server) => server._id.toString()));
  }

  async handleDisconnect(client: Socket) {
    mediasoup.channels.forEach((channel) => {
      const index = channel.findIndex((userId) => userId === client.handshake.auth.userId);
      if (index === -1) return;
      channel.splice(index, 1);
    });
  }
}

export default SocketIoGateway;
