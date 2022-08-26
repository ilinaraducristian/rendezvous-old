import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import { User, UserDocument } from "../entities/user.schema";
import * as bcrypt from "bcrypt";
import DuplicateEmailHttpException from "./exceptions/duplicate-email.httpexception";
import CreateUserDto from "./entities/create-user.dto";

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>, private readonly jwtService: JwtService) {}

  async register(newUser: CreateUserDto) {
    const password = await bcrypt.hash(newUser.password, 10);
    try {
      const createdUser = await new this.userModel({ ...newUser, password }).save();
      const payload = { id: createdUser.id };
      return {
        user: createdUser,
        accessToken: this.jwtService.sign(payload),
      };
    } catch (error) {
      if (error.code === 11000) throw new DuplicateEmailHttpException();
      throw error;
    }
  }

  async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    if (user === null || (await bcrypt.compare(password, user.password)) === false) {
      return null;
    }
    return user;
  }

  async login(user: UserDocument) {
    const payload = { id: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
