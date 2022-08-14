import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ConversationService } from "../conversations/conversation.service";
import { User, UserDocument } from "../entities/user.schema";
import UserNotFoundHttpException from "../friendship/exceptions/user-not-found.httpexception";
import { FriendshipService } from "../friendship/friendship.service";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly friendshipService: FriendshipService,
    private readonly conversationService: ConversationService
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
    const { friendships, friendsIds } = await this.friendshipService.getFriendships(user);
    const conversations = await this.conversationService.getConversations(user);
    const users = await this.userModel.find({ _id: { $in: friendsIds } });
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      friendships,
      conversations,
      users: users.map(user => ({
        id: user.id,
        name: user.name
      }))
    }
  }

}
