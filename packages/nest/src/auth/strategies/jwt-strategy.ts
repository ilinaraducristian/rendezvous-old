import { Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { User, UserDocument } from "../../entities/user.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService, @InjectModel(User.name) private readonly userModel: Model<UserDocument>) {
    super({
      jwtFromRequest: ({cookies: {access_token}}) => access_token,
      secretOrKey: configService.get<string>("JWT_SECRET"),
    });
  }

  async validate({id}: {id: string}) {
    const user = await this.userModel.findById(id);
    if(user === null) throw new UnauthorizedException();
    return user;
  }
}
