import { Controller, Request, Post, UseGuards, Body, Res, HttpCode, ValidationPipe, HttpException, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth-guard";
import { FastifyRequest, FastifyReply } from 'fastify';
import { IgnoreJwt } from "../util";
import { UserDocument } from "../entities/user.schema";
import { CreateUserDto } from "./entities/create-user.dto";
import DuplicateEmailError from "./errors/duplicate-email.error";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @IgnoreJwt()
  @Post('register')
  async register(@Body(new ValidationPipe()) createUserDto: CreateUserDto, @Res({ passthrough: true }) res: FastifyReply) {
    try {
      const { user, accessToken } = await this.authService.register(createUserDto);
      res.setCookie('access_token', accessToken, { httpOnly: true, path: '/', sameSite: 'none', secure: true });
      return { id: user.id };
    } catch (e) {
      if (e instanceof DuplicateEmailError) throw new HttpException('user with this email address already exists', HttpStatus.BAD_REQUEST)
    }
  }

  @UseGuards(LocalAuthGuard)
  @IgnoreJwt()
  @Post("login")
  @HttpCode(204)
  async login(@Request() req: FastifyRequest & { user: UserDocument }, @Res({ passthrough: true }) res: FastifyReply) {
    const { accessToken } = await this.authService.login(req.user);
    res.setCookie('access_token', accessToken, { httpOnly: true, path: '/', sameSite: 'none', secure: true });
  }

}
