import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import { User, UserDocument } from "../entities/user.schema";
import { User as UserDto } from '../types';
import * as bcrypt from 'bcrypt';
import DuplicateEmailError from "./errors/duplicate-email.error";

@Injectable()
export class AuthService {

  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>, private jwtService: JwtService) { }


  async register(newUser: Omit<UserDto, "id">) {
    const password = await bcrypt.hash(newUser.password, 10);
    try {
      const createdUser = await new this.userModel({ ...newUser, password }).save();
      const payload = { sub: createdUser.id, email: createdUser.email };
      return {
        user: createdUser, accessToken: this.jwtService.sign(payload)
      };
    } catch (error) {
      if (error.code === 11000) throw new DuplicateEmailError();
      throw error;
    }
  }

  async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    if (!user || await bcrypt.compare(password, user.password) === false) {
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
