import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Friendship, FriendshipDocument } from "../entities/friendship.schema";
import { User, UserDocument } from "../entities/user.schema";
import { FriendshipMessage, FriendshipMessageDocument } from "./entities/friendship-message.schema";

@Injectable()
export class FriendshipService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Friendship.name) private readonly friendshipModel: Model<FriendshipDocument>,
    @InjectModel(FriendshipMessage.name) private readonly friendshipMessageModel: Model<FriendshipMessageDocument>
  ) { }

  async createFriendship(user1Id: string, user2Id: string) {
    const users = await this.userModel.find({ _id: { $in: [user1Id, user2Id] } });
    if (users.length < 2) throw new Error("users not found");
    const [user1, user2] = users;
    const [exisingFriendship] = await this.friendshipModel.find({ user1: { $in: [user1._id, user2._id] }, user2: { $in: [user1._id, user2._id] } });
    if (exisingFriendship !== undefined) throw new Error("friendship already exists");
    const newFriendship = await new this.friendshipModel({ user1, user2 }).save();
    user1.friendships.push(newFriendship.id);
    user2.friendships.push(newFriendship.id);
    await Promise.all([user1.save(), user2.save()]);
    return newFriendship;
  }

  getFriendship(id: string) {
    return this.friendshipModel.findById(id);
  }

  acceptFriendshipRequest(userId: string, id: string) {
    return this.changeFriendshipStatus(userId, id, 'accepted');
  }

  private async changeFriendshipStatus(userId: string, id: string, status: string) {
    const friendship = await this.friendshipModel.findById(id);
    if (friendship === null) throw new Error("friendship doesn't exist");
    if (friendship.user2._id.toString() !== userId) throw new Error("user doesn't have permission to change this friendship");
    if (friendship.status === 'accepted') throw new Error('friendship already accepted');
    friendship.status = status;
    return friendship.save();
  }

  async deleteFriendship(userId: string, id: string) {
    const user = await this.userModel.findById(userId);
    return this.friendshipModel.deleteOne({ id, $or: [{ user1: user._id, user2: user._id }] });
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
    return this.friendshipMessageModel.find({friendshipId: friendship._id}).sort({timestamp: -1}).skip(offset).limit(limit)
  }

  async getFriendshipMessage() {

  }

  async deleteFriendshipMessage() {

  }


}
