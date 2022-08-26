import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthController } from "./auth/auth.controller";
import { UserController } from "./user/user.controller";
import { UserService } from "./user/user.service";
import { AuthService } from "./auth/auth.service";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { User, UserSchema } from "./entities/user.schema";
import { LocalStrategy } from "./auth/strategies/local-strategy";
import { JwtStrategy } from "./auth/strategies/jwt-strategy";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./auth/guards/jwt-auth-guard";
import { FriendshipMessage, FriendshipMessageSchema } from "./entities/friendship-message.schema";
import { Friendship, FriendshipSchema } from "./entities/friendship.schema";
import { FriendshipService } from "./friendship/friendship.service";
import { ConversationService } from "./conversations/conversation.service";
import { SseService } from "./sse.service";
import { FriendshipController } from "./friendship/friendship.controller";
import { GroupController } from "./group/group.controller";
import { GroupService } from "./group/group.service";
import { ConversationController } from "./conversations/conversation.controller";
import { Group, GroupSchema } from "./entities/group.schema";
import { GroupMessage, GroupMessageSchema } from "./entities/group-message.schema";
import { Server, ServerSchema } from "./entities/server.schema";
import { ServerController } from "./server/server.controller";
import { ServerService } from "./server/server.service";
import { ChannelMessage, ChannelMessageSchema } from "./entities/channel-message.schema";
import { FriendshipMessageService } from "./friendship/message/friendship-message.service";
import { GroupMessageService } from "./group/message/group-message.service";
import { FriendshipMessageController } from "./friendship/message/friendship-message.controller";
import { GroupMessageController } from "./group/message/group-message.controller";
import { ServerGroupController } from "./server/group/server-group.controller";
import { ChannelController } from "./server/group/channel/channel.controller";
import { ChannelMessageController } from "./server/group/channel/message/channel-message.controller";
import { ServerGroupService } from "./server/group/server-group.service";
import { ChannelService } from "./server/group/channel/channel.service";
import { ChannelMessageService } from "./server/group/channel/message/channel-message.service";

@Module(AppModule.MODULE_METADATA)
export class AppModule {
  static MODULE_METADATA = {
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        ignoreEnvFile: process.env.NODE_ENV === "production",
      }),
      MongooseModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          uri: configService.get<string>("MONGODB_URI"),
        }),
      }),
      MongooseModule.forFeature([
        { name: User.name, schema: UserSchema },
        { name: Friendship.name, schema: FriendshipSchema },
        { name: FriendshipMessage.name, schema: FriendshipMessageSchema },
        { name: Group.name, schema: GroupSchema },
        { name: GroupMessage.name, schema: GroupMessageSchema },
        { name: Server.name, schema: ServerSchema },
        { name: ChannelMessage.name, schema: ChannelMessageSchema, collection: null },
      ]),
      PassportModule,
      JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          secret: configService.get<string>("JWT_SECRET"),
          signOptions: { expiresIn: "90d" },
        }),
      }),
    ],
    controllers: [
      AuthController,
      UserController,
      FriendshipController,
      FriendshipMessageController,
      GroupController,
      GroupMessageController,
      ConversationController,
      ServerController,
      ServerGroupController,
      ChannelController,
      ChannelMessageController,
    ],
    providers: [
      {
        provide: APP_GUARD,
        useClass: JwtAuthGuard,
      },
      LocalStrategy,
      JwtStrategy,
      AuthService,
      SseService,
      UserService,
      FriendshipService,
      FriendshipMessageService,
      GroupService,
      GroupMessageService,
      ConversationService,
      ServerService,
      ServerGroupService,
      ChannelService,
      ChannelMessageService,
    ],
  };
}
