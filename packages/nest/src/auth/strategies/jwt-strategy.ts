import { Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ({cookies: {access_token}}) => access_token,
      secretOrKey: configService.get<string>("JWT_SECRET"),
    });
  }

  async validate(payload: {id: string}) {
    return { id: payload.id };
  }
}
