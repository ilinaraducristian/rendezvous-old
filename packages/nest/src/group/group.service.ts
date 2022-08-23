import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Group, GroupDocument } from "../entities/group.schema";
import { ConversationDto, GroupDto } from "../entities/dtos";
import { User, UserDocument } from "../entities/user.schema";
import { UserNotFoundHttpException } from "../exceptions";
import { GroupMessage, GroupMessageDocument } from "../entities/group-message.schema";
import { GroupNotFoundHttpException, UserAlreadyInServerHttpException, UserNotMemberOfGroupHttpException } from "./exceptions";

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Group.name) private readonly groupModel: Model<GroupDocument>,
    @InjectModel(GroupMessage.name) private readonly groupMessageModel: Model<GroupMessageDocument>
  ) { }

  async createGroup(user: UserDocument, name: string): Promise<GroupDto> {
    const newGroup = await new this.groupModel({ name, members: [user._id] }).save();
    user.groups.push(newGroup._id);
    await user.save();
    return new GroupDto(newGroup);
  }

  async getGroup(user: UserDocument, id: string) {
    const userGroup = user.groups.find(groupId => groupId.toString() === id);
    if (userGroup === null) throw new GroupNotFoundHttpException();
    const group = await this.groupModel.findById(userGroup);
    return group;
  }

  async getGroups(user: UserDocument): Promise<GroupDto[]> {
    return (await this.groupModel.find({ _id: { $in: user.groups } })).map(group => new GroupDto(group));
  }

  async deleteGroup(user: UserDocument, id: string): Promise<void> {
    const deleteGroup = await this.groupModel.findByIdAndDelete(id);
    if (deleteGroup === null) throw new GroupNotFoundHttpException();
    const groupIndex = user.groups.findIndex(groupId => groupId.toString() === id);
    user.groups.splice(groupIndex, 1);
    await user.save();
  }

  async createMemberSelf(user: UserDocument, invitation: string) {
    const group = await this.groupModel.findOne({ invitation });
    if (group === null) throw new GroupNotFoundHttpException();
    const groupId = user.groups.find(groupId => groupId.toString() === group.id);
    if (groupId !== undefined) throw new UserAlreadyInServerHttpException();
    group.members.push(user._id);
    user.groups.push(group._id);
    await Promise.all([group.save(), user.save()]);
    return new GroupDto(group);
  }

  async createGroupMessage(user: UserDocument, id: string, text: string) {
    const groupId = user.groups.find(groupId => groupId.toString() === id);
    if (groupId === undefined) throw new UserNotMemberOfGroupHttpException();
    const group = await this.groupModel.findOne({ _id: groupId });
    if (group === null) throw new GroupNotFoundHttpException();
    const newGroupMessage = await new this.groupMessageModel({ groupId: group._id, userId: user._id, timestamp: new Date(), text }).save();
    return new ConversationDto(newGroupMessage);
  }

  async getGroupMessages(user: UserDocument, id: string, offset: number, limit: number): Promise<ConversationDto[]> {
    const group = await this.getGroup(user, id);
    const messages = await this.groupMessageModel.find({ groupId: group._id }).sort({ timestamp: -1 }).skip(offset).limit(limit);
    return messages.map(message => new ConversationDto(message));
  }

}
