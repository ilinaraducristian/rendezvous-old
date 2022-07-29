import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Friendship, FriendshipDocument } from "src/entities/friendship.schema";
import { UserData } from "src/types";

@Injectable()
export class UserService {
  constructor(@InjectModel(Friendship.name) private readonly friendshipModel: Model<FriendshipDocument>) {}

  async getUserData(id: string): Promise<UserData> {
    const friendship = await this.friendshipModel.find({ $or: [{ user1Id: id, user2Id: id }] });
    return {
      friends: [],
      groups: [],
      servers: [],
    };
  }
}
