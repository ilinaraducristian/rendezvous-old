import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../entities/user.schema";
import UserNotFoundHttpException from "../friendship/exceptions/user-not-found.httpexception";
import { FriendshipService } from "../friendship/friendship.service";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly friendshipService: FriendshipService
  ) { }

  async getUser(id: string) {
    const user = await this.userModel.findById(id);
    if (user === null) throw new UserNotFoundHttpException();
    return user;
  }

  async getUsers(ids: string[]) {
    const users = await this.userModel.find({ id: { $in: ids } })
    return users;
  }

  async getUserData(user: UserDocument) {
    const friendships = (await this.friendshipService.getFriendships(user)).map(friendship => ({
      id: friendship.id,
      userId: friendship.user1.toString() === user.id ? friendship.user2.toString() : friendship.user1.toString(),
      status: friendship.status
    }));
    const users = await this.userModel.find({ _id: { $in: friendships.map(friendship => friendship.userId) } });
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      friendships,
      users: users.map(user => ({
        id: user.id,
        name: user.name
      }))
    }
  }

}
