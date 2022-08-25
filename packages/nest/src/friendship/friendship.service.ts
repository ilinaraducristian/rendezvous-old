import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Friendship, FriendshipDocument } from "../entities/friendship.schema";
import { User, UserDocument } from "../entities/user.schema";
import {
  FriendshipAcceptedHttpException,
  FriendshipNotFoundHttpException,
  FriendshipExistsHttpException,
  UserLacksPermissionForFriendshipHttpException,
  CannotBeFriendWithYourselfHttpException,
} from "./exceptions";
import { UserNotFoundHttpException } from "../exceptions";
import { FriendshipStatus } from "./friendship.dto";

@Injectable()
export class FriendshipService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Friendship.name) private readonly friendshipModel: Model<FriendshipDocument>
  ) { }

  async createFriendship(user: UserDocument, friendUserId: string) {
    if (user.id === friendUserId) throw new CannotBeFriendWithYourselfHttpException();
    const friendUser = await this.userModel.findById(friendUserId);
    if (friendUser === null) throw new UserNotFoundHttpException();
    const exisingFriendship = await this.friendshipModel.findOne({ $or: [{ user1: user._id, user2: friendUser._id }, { user1: friendUser._id, user2: user._id }] });
    if (exisingFriendship !== null) throw new FriendshipExistsHttpException();
    const friendship = await new this.friendshipModel({ user1: user._id, user2: friendUser._id }).save();
    user.friendships.push(friendship.id);
    friendUser.friendships.push(friendship.id);
    await Promise.all([user.save(), friendUser.save()]);
    return friendship;
  }

  async getFriendship(user: UserDocument, id: string) {
    const friendshipId = user.friendships.find(friendshipId => friendshipId.toString() === id);
    if (friendshipId === undefined) throw new FriendshipNotFoundHttpException();
    const friendship = await this.friendshipModel.findById(id);
    return friendship;
  }

  async getFriendships(user: UserDocument) {
    const friendships = await this.friendshipModel.find({ _id: { $in: user.friendships } });
    return friendships;
  }

  async acceptFriendshipRequest(user: UserDocument, id: string) {
    const friendship = await this.getFriendship(user, id);
    if (friendship.user1.toString() === user.id) throw new UserLacksPermissionForFriendshipHttpException();
    if (friendship.status === 'accepted') throw new FriendshipAcceptedHttpException();
    friendship.status = FriendshipStatus.accepted;
    await Promise.all([user.save(), friendship.save()]);
    return friendship;
  }

  async deleteFriendship(user: UserDocument, id: string) {
    const deletedFriendship = await this.friendshipModel.findOneAndRemove({ id, $or: [{ user1: user._id }, { user2: user._id }] });
    if (deletedFriendship === null) throw new FriendshipNotFoundHttpException();
    const otherId = user.id === deletedFriendship.user1.toString() ? deletedFriendship.user2.toString() : deletedFriendship.user1.toString();
    const friendUser = await this.userModel.findById(otherId);
    const friendshipIndex1 = user.friendships.findIndex(friendshipId => friendshipId.toString() === id);
    const friendshipIndex2 = friendUser.friendships.findIndex(friendshipId => friendshipId.toString() === id);
    user.friendships.splice(friendshipIndex1, 1);
    friendUser.friendships.splice(friendshipIndex2, 1);
    await Promise.all([user.save(), friendUser.save()]);
    return deletedFriendship;
  }

}
