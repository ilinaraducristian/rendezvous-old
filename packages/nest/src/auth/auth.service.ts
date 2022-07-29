import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "src/entities/user.schema";
import { JwtService } from "@nestjs/jwt";
import { User as UserDto } from "src/types";

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>, private jwtService: JwtService) {}

  register(newUser: Omit<UserDto, "id">) {
    return new this.userModel(newUser).save();
  }

  async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    if (!user || user.password !== password) {
      return null;
    }
    return user;
  }

  async login(user: UserDocument) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {expiresIn: '3m'}),
    };
  }

  async refresh(user: UserDocument) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }

}
