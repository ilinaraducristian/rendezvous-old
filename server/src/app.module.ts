import { Module } from "@nestjs/common";
import { ServersController } from "./controllers/servers/servers.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthGuard, KeycloakConnectModule } from "nest-keycloak-connect";
import { APP_GUARD } from "@nestjs/core";
import { ServerEntity } from "./entities/server.entity";
import { SocketIOGateway } from "./socketio.gateway";
import { ChannelsController } from "./controllers/channels/channels.controller";
import { UsersController } from "./controllers/users/users.controller";
import { InvitationsController } from "./controllers/invitations/invitations.controller";

@Module({
  imports: [
    TypeOrmModule.forRoot({
        type: process.env.DB_TYPE as ('mysql' | 'mariadb'),
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        entities: [
          "dist/**/*.entity{.ts,.js}"
        ],
        synchronize: false
      }
    ),
    TypeOrmModule.forFeature([ServerEntity]),
    KeycloakConnectModule.register({
      authServerUrl: process.env.AUTH_SERVER_URL,
      realm: process.env.REALM,
      clientId: process.env.CLIENT_ID,
      secret: process.env.SECRET,
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
    AppService,
    SocketIOGateway
  ]
})
export class AppModule {
}