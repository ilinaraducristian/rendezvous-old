import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ServerController } from './server/server.controller';
import { ServerService } from './server/server.service';
import { AuthController } from './auth/auth.controller';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from "@nestjs/jwt";
import { User, UserSchema } from "./entities/user.schema";

@Module({
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
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60s' },
      }),
    })
  ],
  controllers: [/*AppController, ServerController, UserController, */AuthController],
  providers: [/*AppService, ServerService, UserService, */LocalStrategy, AuthService],
})
export class AppModule {}
