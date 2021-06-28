import { Module } from "@nestjs/common";
import { ServersController } from "./controllers/servers/servers.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthGuard, KeycloakConnectModule, ResourceGuard, RoleGuard } from "nest-keycloak-connect";
import { APP_GUARD } from "@nestjs/core";
import { ServerEntity } from "./entities/server.entity";
import { SocketIOGateway } from "./socketio.gateway";
import { ChannelsController } from "./controllers/channels/channels.controller";
import { UsersController } from "./controllers/users/users.controller";
import { InvitationsController } from "./controllers/invitations/invitations.controller";
import config from "./config";

@Module({
  imports: [
TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([ServerEntity]),
    KeycloakConnectModule.register({
      authServerUrl: config.keycloak.authServerUrl,
      realm: config.keycloak.realm,
      clientId: config.keycloak.clientId,
      secret: config.keycloak.secret,
      // optional if you want to retrieve JWT from cookie
      cookieKey: "KEYCLOAK_JWT",
      // optional loglevels. default is verbose
      logLevels: ["warn"]
    })
  ],
  controllers: [ServersController, ChannelsController, UsersController, InvitationsController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard
    },
    AppService,
    SocketIOGateway
  ]
})
export class AppModule {
}