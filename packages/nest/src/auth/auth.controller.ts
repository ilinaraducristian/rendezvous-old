import { Controller, Request, Post, UseGuards, Body } from "@nestjs/common";
import { User } from "src/types";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth-guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() newUser: Omit<User, 'id'>) {
    return this.authService.register(newUser);
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  login(@Request() req) {
    return this.authService.login(req.user);
  }

}
