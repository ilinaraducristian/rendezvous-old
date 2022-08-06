import { Controller, Request, Post, UseGuards, Body, Res, HttpCode, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth-guard";
import { FastifyRequest, FastifyReply } from 'fastify';
import { IgnoreJwt } from "../util";
import { User } from "../types";
import { UserDocument } from "../entities/user.schema";
import { CreateUserDto } from "./entities/create-user.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IgnoreJwt()
  @Post('register')
  async register(@Body(new ValidationPipe()) createUserDto: CreateUserDto, @Res({ passthrough: true }) res: FastifyReply) {
    const {user, accessToken} = await this.authService.register(createUserDto);
    res.setCookie('access_token', accessToken, {httpOnly: true, path: '/', sameSite: 'none', secure: true});
    return {id: user.id};
  }

  @UseGuards(LocalAuthGuard)
  @IgnoreJwt()
  @Post("login")
  @HttpCode(204)
  async login(@Request() req: FastifyRequest & {user: UserDocument}, @Res({ passthrough: true }) res: FastifyReply) {
    const {accessToken} = await this.authService.login(req.user);
    res.setCookie('access_token', accessToken, {httpOnly: true, path: '/', sameSite: 'none', secure: true});
  }

}
