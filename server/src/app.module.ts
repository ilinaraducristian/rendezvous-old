import { Module } from "@nestjs/common";
import { ServersController } from "./servers/servers.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthGuard, KeycloakConnectModule, ResourceGuard, RoleGuard } from "nest-keycloak-connect";
import { APP_GUARD } from "@nestjs/core";
import { Server } from "./entities/server.entity";
import { MessagesController } from "./message/messages.controller";
import { SocketIOGateway } from "./socketio.gateway";
import { ChannelsController } from "./channels/channels.controller";
import config from "./config";

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    // TypeOrmModule.forRootAsync({
    //   useFactory: async () =>
    //     Object.assign(await getConnectionOptions(), {
    //       autoLoadEntities: true,
    //     }),
    // })
    TypeOrmModule.forFeature([Server]),
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
  controllers: [ServersController, MessagesController, ChannelsController],
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
