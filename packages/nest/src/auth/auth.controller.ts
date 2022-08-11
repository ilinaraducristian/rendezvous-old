import { Controller, Post, UseGuards, Body, Res, HttpCode, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth-guard";
import { FastifyReply } from 'fastify';
import { ExtractAuthenticatedUser, IgnoreJwt } from "../util";
import CreateUserDto from "./entities/create-user.dto";
import { CookieSerializeOptions } from "@fastify/cookie";
import { UserDocument } from "../entities/user.schema";

@Controller('auth')
export class AuthController {

  static readonly COOKIES_OPTIONS: CookieSerializeOptions = { httpOnly: true, path: '/', sameSite: 'none', secure: process.env.NODE_ENV === 'production' };

  constructor(private readonly authService: AuthService) { }

  @IgnoreJwt()
  @Post('register')
  async register(@Body(new ValidationPipe()) createUserDto: CreateUserDto, @Res({ passthrough: true }) res: FastifyReply) {
    const { user, accessToken } = await this.authService.register(createUserDto);
    res.setCookie('access_token', accessToken, AuthController.COOKIES_OPTIONS);
    return { id: user.id };
  }

  @UseGuards(LocalAuthGuard)
  @IgnoreJwt()
  @Post("login")
  @HttpCode(204)
  async login(@ExtractAuthenticatedUser() user: UserDocument, @Res({ passthrough: true }) res: FastifyReply) {
    const { accessToken } = await this.authService.login(user);
    res.setCookie('access_token', accessToken, AuthController.COOKIES_OPTIONS);
  }

}
