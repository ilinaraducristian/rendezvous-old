import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Friendship, FriendshipDocument } from "../entities/friendship.schema";
import { User, UserDocument } from "../entities/user.schema";
import { FriendshipMessage, FriendshipMessageDocument } from "../entities/friendship-message.schema";
import {
  FriendshipAcceptedHttpException,
  FriendshipNotFoundHttpException,
  FriendshipExistsHttpException,
  UserLacksPermissionForFriendshipHttpException,
  FriendshipMessageNotFoundHttpException,
  CannotBeFriendWithYourselfHttpException
} from "./exceptions";
import { SseService } from "../sse.service";
import { UserNotFoundHttpException } from "../exceptions";
import { ConversationDto, FriendshipDto, FriendshipStatus } from "../entities/dtos";

@Injectable()
export class FriendshipService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Friendship.name) private readonly friendshipModel: Model<FriendshipDocument>,
    @InjectModel(FriendshipMessage.name) private readonly friendshipMessageModel: Model<FriendshipMessageDocument>,
    private readonly sseService: SseService
  ) { }

  async createFriendship(user: UserDocument, friendUserId: string): Promise<FriendshipDto> {
    if (user.id === friendUserId) throw new CannotBeFriendWithYourselfHttpException();
    const friendUser = await this.userModel.findById(friendUserId);
    if (friendUser === null) throw new UserNotFoundHttpException();
    const exisingFriendship = await this.friendshipModel.findOne({ $or: [{ user1: user._id, user2: friendUser._id }, { user1: friendUser._id, user2: user._id }] });
    if (exisingFriendship !== null) throw new FriendshipExistsHttpException();
    const friendship = await new this.friendshipModel({ user1: user._id, user2: friendUser._id }).save();
    user.friendships.push(friendship.id);
    friendUser.friendships.push(friendship.id);
    await Promise.all([user.save(), friendUser.save()]);
    this.sseService.friendRequest(friendUser.id, new FriendshipDto(friendUser, friendship));
    return new FriendshipDto(user, friendship);
  }

  async getFriendship(user: UserDocument, id: string) {
    const userFriendship = user.friendships.find(friendshipId => friendshipId.toString() === id);
    if (userFriendship === null) throw new FriendshipNotFoundHttpException();
    const friendship = await this.friendshipModel.findById(userFriendship);
    return friendship;
  }

  async getFriendships(user: UserDocument): Promise<FriendshipDto[]> {
    const friendshipsDocuments = await this.friendshipModel.find({ _id: { $in: user.friendships } });
    return friendshipsDocuments.map(friendshipDocument => new FriendshipDto(user, friendshipDocument));
  }

  async acceptFriendshipRequest(user: UserDocument, id: string): Promise<void> {
    const friendship = await this.friendshipModel.findById(id);
    if (friendship === null || friendship === undefined) throw new FriendshipNotFoundHttpException();
    if (friendship.user1._id.toString() === user.id) throw new UserLacksPermissionForFriendshipHttpException();
    if (friendship.status === 'accepted') throw new FriendshipAcceptedHttpException();
    friendship.status = FriendshipStatus.accepted;
    user.friendships.push(friendship._id);
    await Promise.all([user.save(), friendship.save()]);
    this.sseService.acceptFriendshipRequest(friendship.user1._id.toString(), id);
  }

  async deleteFriendship(user: UserDocument, id: string): Promise<void> {
    const deletedFriendship = await this.friendshipModel.findOneAndRemove({ id, $or: [{ user1: user._id }, { user2: user._id }] });
    if (deletedFriendship === null) throw new FriendshipNotFoundHttpException();
    const otherId = user.id === deletedFriendship.user1.toString() ? deletedFriendship.user2.toString() : deletedFriendship.user1.toString();
    const friendUser = await this.userModel.findById(otherId);
    const friendshipIndex1 = user.friendships.findIndex(friendshipId => friendshipId.toString() === id);
    const friendshipIndex2 = friendUser.friendships.findIndex(friendshipId => friendshipId.toString() === id);
    user.friendships.splice(friendshipIndex1, 1);
    friendUser.friendships.splice(friendshipIndex2, 1);
    await Promise.all([user.save(), friendUser.save()]);
    this.sseService.deleteFriendship(otherId, id);
  }

  async createFriendshipMessage(user: UserDocument, id: string, text: string): Promise<ConversationDto> {
    const friendship = await this.getFriendship(user, id);

    const newMessage = await new this.friendshipMessageModel({
      friendshipId: friendship._id,
      userId: user._id,
      timestamp: new Date(),
      text
    }).save();

    const otherId = friendship.user1.toString() === user.id ? friendship.user2.toString() : friendship.user1.toString();
    const message = new ConversationDto(newMessage);
    this.sseService.friendshipMessage(otherId, message);
    return message;
  }

  async getFriendshipMessages(user: UserDocument, id: string, offset: number, limit: number): Promise<ConversationDto[]> {
    const friendship = await this.getFriendship(user, id);
    const messages = await this.friendshipMessageModel.find({ friendshipId: friendship._id }).sort({ timestamp: -1 }).skip(offset).limit(limit);
    return messages.map(message => new ConversationDto(message));
  }

  async getFriendshipMessage(user: UserDocument, id: string, messageId: string) {
    const friendship = await this.getFriendship(user, id);
    const message = await this.friendshipMessageModel.findOne({ _id: new Types.ObjectId(messageId), friendshipId: friendship._id });
    if (message === null) throw new FriendshipMessageNotFoundHttpException();
    return message;
  }

  async deleteFriendshipMessage(user: UserDocument, id: string, messageId: string) {
    const friendship = await this.getFriendship(user, id);
    const message = await this.friendshipMessageModel.findOneAndRemove({ _id: new Types.ObjectId(messageId), friendshipId: friendship._id });
    if (message === null) throw new FriendshipMessageNotFoundHttpException();
    const otherId = user.id === friendship.user1.toString() ? friendship.user2.toString() : friendship.user1.toString();
    this.sseService.deleteFriendshipMessage(otherId, id, messageId);
  }

  async deleteFriendshipMessages(user: UserDocument, id: string) {
    const friendship = await this.getFriendship(user, id);
    const messages = await this.friendshipMessageModel.deleteMany({ friendshipId: friendship._id });
    if (messages.deletedCount === 0) throw new FriendshipMessageNotFoundHttpException();
    const otherId = user.id === friendship.user1.toString() ? friendship.user2.toString() : friendship.user1.toString();
  }

}
