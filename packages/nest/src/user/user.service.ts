import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FriendshipMessage, FriendshipMessageDocument } from "src/entities/friendship-message.schema";
import { Friendship, FriendshipDocument } from "src/entities/friendship.schema";
import { User, UserDocument } from "src/entities/user.schema";
import { UserData } from "src/types";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Friendship.name) private readonly friendshipModel: Model<FriendshipDocument>,
    @InjectModel(FriendshipMessage.name) private readonly friendshipMessageModel: Model<FriendshipMessageDocument>
  ) {}

  async getUserData(id: string): Promise<UserData> {
    const user = await this.userModel.findById(id);
    const friendshipsMessages = await this.friendshipMessageModel.find({friendshipId: {$in: user.friendships.map((f: FriendshipDocument) => f.id)}});
    return {
      friends: [],
      groups: [],
      servers: [],
    };
  }

  async createFriendship(user1Id: string, user2Id: string) {
    const [user1, user2] = await this.userModel.find({ id: { $in: [user1Id, user2Id] } });
    const newFriendship = await new this.friendshipModel({ user1, user2 }).save();
    user1.friendships.push(newFriendship.id);
    user2.friendships.push(newFriendship.id);
    await Promise.all([user1.save(), user2.save()]);
    return newFriendship;
  }

  async getFriendships(userId: string) {
    return (await this.userModel.findById(userId)).friendships;
  }

  async createFriendshipMessage(userId: string, friendshipId: string, text: string) {
    return new this.friendshipMessageModel({ userId, friendshipId, text }).save();
  }

  getFriedshipMessages(userId: string, friendshipId: string) {
    return this.friendshipMessageModel.find({ friendshipId });
  }
}
