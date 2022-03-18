import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthGuard, KeycloakConnectModule } from "nest-keycloak-connect";
import { ChannelMessagesController } from "./controllers/channel-messages.controller";
import { ChannelsController } from "./controllers/channels.controller";
import { FriendshipMessagesController } from "./controllers/friendship-messages.controller";
import { FriendshipsController } from "./controllers/friendships.controller";
import { GroupsController } from "./controllers/groups.controller";
import { ReactionsController } from "./controllers/reactions.controller";
import { ServersController } from "./controllers/servers.controller";
import SocketIoGateway from "./controllers/socket-io.gateway";
import { UsersController } from "./controllers/users.controller";
import Friendship, { FriendshipSchema } from "./entities/friendship";
import Member, { MemberSchema } from "./entities/member";
import { ChannelMessage, ChannelMessageSchema, FriendshipMessage, FriendshipMessageSchema } from "./entities/message";
import Server, { ServerSchema } from "./entities/server";
import { ChannelMessagesService } from "./services/channel-messages.service";
import { ChannelsService } from "./services/channels.service";
import { EmojisService } from "./services/emojis.service";
import { FriendshipMessagesService } from "./services/friendship-messages.service";
import { FriendshipsService } from "./services/friendships.service";
import { GroupsService } from "./services/groups.service";
import { KeycloakAdminService } from "./services/keycloak-admin.service";
import { ReactionsService } from "./services/reactions.service";
import { ServersService } from "./services/servers.service";
import { SocketIoService } from "./services/socket-io.service";
import { UsersService } from "./services/users.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development',
      ignoreEnvFile: process.env.NODE_ENV === "prodution"
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: "mongodb://mongo/",
        auth: {
          username: configService.get<string>('MONGO_USERNAME'),
          password: configService.get<string>('MONGO_PASSWORD'),
        },
        dbName: configService.get<string>('DB')
      }),
      inject: [ConfigService],
    }),
    KeycloakConnectModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        authServerUrl: configService.get<string>('KEYCLOAK_AUTH_URL'),
        realm: configService.get<string>('KEYCLOAK_REALM'),
        clientId: configService.get<string>('API_CLIENT_ID'),
        secret: configService.get<string>('API_CLIENT_SECRET'),
        useNestLogger: false,
        logLevels: ['debug'],
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Server.name, schema: ServerSchema },
      { name: ChannelMessage.name, schema: ChannelMessageSchema },
      { name: Member.name, schema: MemberSchema },
      { name: Friendship.name, schema: FriendshipSchema },
      { name: FriendshipMessage.name, schema: FriendshipMessageSchema },
    ]),
  ],
  controllers: [
    UsersController,
    ServersController,
    GroupsController,
    ChannelsController,
    ChannelMessagesController,
    ReactionsController,
    FriendshipsController,
    FriendshipMessagesController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    ServersService,
    GroupsService,
    EmojisService,
    ChannelsService,
    ChannelMessagesService,
    ReactionsService,
    FriendshipMessagesService,
    UsersService,
    SocketIoGateway,
    SocketIoService,
    FriendshipsService,
    KeycloakAdminService,
  ],
})
export class AppModule {}
