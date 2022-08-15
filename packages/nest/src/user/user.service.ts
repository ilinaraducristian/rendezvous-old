import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ConversationService } from "../conversations/conversation.service";
import { User, UserDocument } from "../entities/user.schema";
import { UserNotFoundHttpException } from "../exceptions";
import { FriendshipService } from "../friendship/friendship.service";
import { GroupService } from "../group/group.service";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly friendshipService: FriendshipService,
    private readonly groupService: GroupService,
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
    const groups = await this.groupService.getGroups(user);
    const userIds = new Map<string, any>();
    friendsIds.forEach(friendId => userIds.set(friendId.toString(), friendId));
    groups.map(group => group.members).flat().forEach(userId => userIds.set(userId.toString(), userId));
    const conversations = await this.conversationService.getConversations(user);
    userIds.delete(user.id);
    const users = await this.userModel.find({ _id: { $in: Array.from(userIds.values()) } });
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      friendships,
      conversations,
      groups,
      users: users.map(user => ({
        id: user.id,
        name: user.name
      }))
    }
  }

}
