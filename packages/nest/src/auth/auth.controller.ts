import { Controller, Request, Post, UseGuards, Body, Res } from "@nestjs/common";
import { User } from "src/types";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth-guard";
import { FastifyRequest, FastifyReply } from 'fastify';
import { IgnoreJwt } from "src/util";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IgnoreJwt()
  @Post('register')
  register(@Body() newUser: Omit<User, 'id'>) {
    return this.authService.register(newUser);
  }

  @UseGuards(LocalAuthGuard)
  @IgnoreJwt()
  @Post("login")
  async login(@Request() req: FastifyRequest & {user: any}, @Res({ passthrough: true }) res: FastifyReply) {
    const payload = await this.authService.login(req.user);
    res.setCookie('access_token', payload.access_token, {httpOnly: true, path: '/'});
    res.setCookie('refresh_token', payload.refresh_token, {httpOnly: true, path: '/'});
  }

}
