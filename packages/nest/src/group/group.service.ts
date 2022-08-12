import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Group, GroupDocument } from "../entities/group.schema";
import { User, UserDocument } from "../entities/user.schema";
import UserNotFoundHttpException from "../friendship/exceptions/user-not-found.httpexception";
import GroupNotFoundHttpException from "./exceptions/group-not-found.httpexception";

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private readonly groupModel: Model<GroupDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) { }

  async createGroup(user: UserDocument, name: string) {
    const newGroup = await new this.groupModel({ name, members: [user._id] }).save();
    user.groups.push(newGroup._id);
    await user.save();
    return newGroup;
  }

  async getGroups(user: UserDocument) {
    return this.groupModel.find({ _id: { $in: user.groups } });
  }

  async deleteGroup(user: UserDocument, id: string) {
    const deleteGroup = await this.groupModel.findByIdAndDelete(id);
    if (deleteGroup === null) throw new GroupNotFoundHttpException();
    const groupIndex = user.groups.findIndex(group => group.id === id);
    user.groups.splice(groupIndex, 1);
    await user.save();
    return deleteGroup;
  }

  async createGroupMember(user: UserDocument, id: string, userId: string) {
    const group = await this.groupModel.findById(id);
    if (group === null) throw new GroupNotFoundHttpException();
    const newMember = await this.userModel.findById(userId);
    if (newMember === null) throw new UserNotFoundHttpException();
    group.members.push(newMember._id);
    newMember.groups.push(group._id);
    await Promise.all([group.save(), newMember.save()]);
  }

}
