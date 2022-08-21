import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Group, GroupDocument } from "../entities/group.schema";
import { GroupDto } from "../entities/user-data.dto";
import { User, UserDocument } from "../entities/user.schema";
import { UserNotFoundHttpException } from "../exceptions";
import { GroupMessage, GroupMessageDocument } from "../entities/group-message.schema";
import { GroupNotFoundHttpException, UserNotMemberOfGroupHttpException } from "./exceptions";

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

  async createGroupMember(user: UserDocument, id: string, userId: string): Promise<void> {
    const groupId = user.groups.find(groupId => groupId.toString() === id);
    if (groupId === undefined) throw new UserNotMemberOfGroupHttpException();
    const group = await this.groupModel.findOne({ _id: groupId });
    if (group === null) throw new GroupNotFoundHttpException();
    const newMember = await this.userModel.findById(userId);
    if (newMember === null) throw new UserNotFoundHttpException();
    group.members.push(newMember._id);
    newMember.groups.push(group._id);
    await Promise.all([group.save(), newMember.save()]);
  }

  async createGroupMessage(user: UserDocument, id: string, text: string) {
    const groupId = user.groups.find(groupId => groupId.toString() === id);
    if (groupId === undefined) throw new UserNotMemberOfGroupHttpException();
    const group = await this.groupModel.findOne({ _id: groupId });
    if (group === null) throw new GroupNotFoundHttpException();
    const newGroupMessage = await new this.groupMessageModel({ groupId: group._id, userId: user._id, timestamp: new Date(), text }).save();
    return newGroupMessage;
  }

}
