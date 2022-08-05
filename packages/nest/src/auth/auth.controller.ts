import { Controller, Request, Post, UseGuards, Body, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth-guard";
import { FastifyRequest, FastifyReply } from 'fastify';
import { IgnoreJwt } from "../util";
import { User } from "../types";
import { UserDocument } from "../entities/user.schema";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IgnoreJwt()
  @Post('register')
  async register(@Body() newUser: Omit<User, 'id'>, @Res({ passthrough: true }) res: FastifyReply) {
    const {user, accessToken} = await this.authService.register(newUser);
    res.setCookie('access_token', accessToken, {httpOnly: true, path: '/', sameSite: 'none', secure: true});
    return {id: user.id};
  }

  @UseGuards(LocalAuthGuard)
  @IgnoreJwt()
  @Post("login")
  async login(@Request() req: FastifyRequest & {user: UserDocument}, @Res({ passthrough: true }) res: FastifyReply) {
    const {accessToken} = await this.authService.login(req.user);
    res.setCookie('access_token', accessToken, {httpOnly: true, path: '/', sameSite: 'none', secure: true});
  }

}
