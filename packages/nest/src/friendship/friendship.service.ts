import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Friendship, FriendshipDocument } from "../entities/friendship.schema";
import { User, UserDocument } from "../entities/user.schema";
import { FriendshipMessage, FriendshipMessageDocument } from "./entities/friendship-message.schema";
import FriendshipAcceptedHttpException from "./exceptions/friendship-accepted.httpexception";
import FriendshipNotFoundHttpException from "./exceptions/friendship-doesnt-exists.httpexception";
import FriendshipExistsHttpException from "./exceptions/friendship-exists.httpexception";
import UserLacksPermissionForFriendshipHttpException from "./exceptions/friendship-no-permission.httpexception";
import UserNotFoundHttpException from "./exceptions/user-not-found.httpexception";

@Injectable()
export class FriendshipService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Friendship.name) private readonly friendshipModel: Model<FriendshipDocument>,
    @InjectModel(FriendshipMessage.name) private readonly friendshipMessageModel: Model<FriendshipMessageDocument>
  ) { }

  async createFriendship(user: UserDocument, friendUserId: string) {
    const friendUser = await this.userModel.findById(friendUserId);
    if (friendUser === null) throw new UserNotFoundHttpException();
    const exisingFriendship = await this.friendshipModel.findOne({ user1: { $in: [user._id, friendUser._id] }, user2: { $in: [user._id, friendUser._id] } });
    if (exisingFriendship !== null) throw new FriendshipExistsHttpException();
    const newFriendship = await new this.friendshipModel({ user1: user, user2: friendUser }).save();
    user.friendships.push(newFriendship.id);
    friendUser.friendships.push(newFriendship.id);
    await Promise.all([user.save(), friendUser.save()]);
    return newFriendship;
  }

  getFriendships(user: UserDocument) {
    return this.friendshipModel.find({_id: {$in: user.friendships}});
  }

  async acceptFriendshipRequest(user: UserDocument, id: string) {
    const friendship = await this.friendshipModel.findById(id);
    if (friendship === null) throw new FriendshipNotFoundHttpException();
    if (friendship.user2.id !== user.id) throw new UserLacksPermissionForFriendshipHttpException();
    if (friendship.status === 'accepted') throw new FriendshipAcceptedHttpException();
    friendship.status = 'accepted';
    return friendship.save();
  }

  async deleteFriendship(user: UserDocument, id: string) {
    const deleteFriendship = await this.friendshipModel.deleteOne({ id, $or: [{ user1: user._id }, { user2: user._id }] });
    if (deleteFriendship.deletedCount === 0) throw new FriendshipNotFoundHttpException();
    const friendshipIndex = user.friendships.findIndex(friendship => friendship.id === id);
    user.friendships.splice(friendshipIndex, 1);
    await user.save();
    return deleteFriendship;
  }

  async createFriendshipMessage(userId: string, id: string, text: string) {
    const friendship = await this.friendshipModel.findById(id);
    return new this.friendshipMessageModel({
      friendshipId: friendship._id,
      userId: friendship.user1._id.toString() === userId ? friendship.user1._id : friendship.user2._id,
      timestamp: new Date(),
      text
    }).save();
  }

  async getFriendshipMessages(userId: string, id: string, offset: number, limit: number) {
    const friendship = await this.friendshipModel.findById(id);
    return this.friendshipMessageModel.find({ friendshipId: friendship._id }).sort({ timestamp: -1 }).skip(offset).limit(limit)
  }

  async getFriendshipMessage() {

  }

  async deleteFriendshipMessage() {

  }


}
