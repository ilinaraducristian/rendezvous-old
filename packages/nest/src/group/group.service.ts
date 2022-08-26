import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Group, GroupDocument } from "../entities/group.schema";
import { UserDocument } from "../entities/user.schema";
import { GroupNotFoundHttpException, UserAlreadyInServerHttpException, UserNotMemberOfGroupHttpException } from "./exceptions";

@Injectable()
export class GroupService {
  constructor(@InjectModel(Group.name) private readonly groupModel: Model<GroupDocument>) {}

  async createGroup(user: UserDocument, name: string) {
    const newGroup = await new this.groupModel({ name, members: [user._id] }).save();
    user.groups.push(newGroup._id);
    await user.save();
    return newGroup;
  }

  async getGroup(user: UserDocument, id: string) {
    const userGroup = user.groups.find((groupId) => groupId.toString() === id);
    if (userGroup === undefined) throw new UserNotMemberOfGroupHttpException();
    const group = await this.groupModel.findById(userGroup);
    if (group === null) throw new GroupNotFoundHttpException();
    return group;
  }

  async getGroups(user: UserDocument) {
    return await this.groupModel.find({ _id: { $in: user.groups } });
  }

  async deleteGroup(user: UserDocument, id: string) {
    const deleteGroup = await this.groupModel.findByIdAndDelete(id);
    if (deleteGroup === null) throw new GroupNotFoundHttpException();
    const groupIndex = user.groups.findIndex((groupId) => groupId.toString() === id);
    user.groups.splice(groupIndex, 1);
    await user.save();
    return deleteGroup;
  }

  async createMemberSelf(user: UserDocument, invitation: string) {
    const group = await this.groupModel.findOne({ invitation });
    if (group === null) throw new GroupNotFoundHttpException();
    const groupId = user.groups.find((groupId) => groupId.toString() === group.id);
    if (groupId !== undefined) throw new UserAlreadyInServerHttpException();
    group.members.push(user._id);
    user.groups.push(group._id);
    await Promise.all([group.save(), user.save()]);
    return group;
  }
}
