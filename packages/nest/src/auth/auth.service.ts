import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import { User, UserDocument } from "../entities/user.schema";
import { User as UserDto } from '../types';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>, private jwtService: JwtService) { }

  async register(newUser: Omit<UserDto, "id">) {
    const createdUser = await new this.userModel(newUser).save();
    const payload = { sub: createdUser.id, email: createdUser.email };
    return {
      user: createdUser, accessToken: this.jwtService.sign(payload)
    };
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
      accessToken: this.jwtService.sign(payload)
    };
  }

}
