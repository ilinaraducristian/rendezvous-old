import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FriendshipMessage, FriendshipMessageDocument } from "../friendship/entities/friendship-message.schema";
import { Friendship, FriendshipDocument } from "../entities/friendship.schema";
import { User, UserDocument } from "../entities/user.schema";
import { UserData } from "../types";
import UserNotFoundHttpException from "../friendship/exceptions/user-not-found.httpexception";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Friendship.name) private readonly friendshipModel: Model<FriendshipDocument>,
    @InjectModel(FriendshipMessage.name) private readonly friendshipMessageModel: Model<FriendshipMessageDocument>
  ) {}

  async getUser(id: string) {
    const user = await this.userModel.findById(id);
    if(user === null) throw new UserNotFoundHttpException();
    return user;
  }

  async getUsers(ids: string[]) {
    const users = await this.userModel.find({id: {$in: ids}})
    return users;
  }

  async getData(id: string): Promise<UserData> {
    const user = await this.userModel.findById(id);
    const friendshipsMessages = await this.friendshipMessageModel.find({friendshipId: {$in: user.friendships}}).limit(1);
    console.log(user.friendships)
    return {
      friends: [],
      groups: [],
      servers: [],
    };
  }
  
}
