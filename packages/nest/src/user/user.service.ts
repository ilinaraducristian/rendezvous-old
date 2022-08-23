import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ConversationService } from "../conversations/conversation.service";
import { MyUserDto, UserDataDto, UserDto } from "../entities/dtos";
import { User, UserDocument } from "../entities/user.schema";
import { UserNotFoundHttpException } from "../exceptions";
import { FriendshipService } from "../friendship/friendship.service";
import { GroupService } from "../group/group.service";
import { ServerService } from "../server/server.service";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly friendshipService: FriendshipService,
    private readonly groupService: GroupService,
    private readonly conversationService: ConversationService,
    private readonly serverService: ServerService,
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

  async getUserData(user: UserDocument): Promise<UserDataDto> {
    const [friendships, groups, servers, conversations] = await Promise.all([
      this.friendshipService.getFriendships(user),
      this.groupService.getGroups(user),
      this.serverService.getServers(user),
      this.conversationService.getConversations(user)
    ]);
    const userIds = new Map<string, Types.ObjectId>();
    friendships.forEach(friendship => {
      userIds.set(friendship.userId, new Types.ObjectId(friendship.userId));
    })
    groups.map(group => group.members).flat().forEach(userId => userIds.set(userId, new Types.ObjectId(userId)));
    servers.map(server => server.members).flat().forEach(userId => userIds.set(userId, new Types.ObjectId(userId)));
    userIds.delete(user.id);
    const users = (await this.userModel.find({ _id: { $in: Array.from(userIds.values()) } })).map(user => new UserDto(user));
    return {
      ...new MyUserDto(user),
      friendships,
      conversations,
      groups,
      servers,
      users
    }
  }

}
