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
import { FriendshipMessage, FriendshipMessageSchema } from "./friendship/entities/friendship-message.schema";
import { Group, GroupSchema } from "./entities/group.schema";
import { GroupMessage, GroupMessageSchema } from "./entities/group-message.schema";
import { Friendship, FriendshipSchema } from "./entities/friendship.schema";
import { FriendshipService } from "./friendship/friendship.service";
import { ConversationService } from "./conversations/conversation.service";

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
    controllers: [AuthController, UserController],
    providers: [
      LocalStrategy,
      JwtStrategy,
      AuthService,
      UserService,
      FriendshipService,
      ConversationService,
      {
        provide: APP_GUARD,
        useClass: JwtAuthGuard,
      },
    ],
  };

}
