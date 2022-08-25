import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { GroupMessage, GroupMessageDocument } from "../../entities/group-message.schema";
import { UserDocument } from "../../entities/user.schema";
import { GroupService } from "../group.service";

@Injectable()
export class GroupMessageService {
  constructor(
    @InjectModel(GroupMessage.name) private readonly groupMessageModel: Model<GroupMessageDocument>,
    private readonly groupService: GroupService
  ) { }

  async createGroupMessage(user: UserDocument, id: string, text: string) {
    const group = await this.groupService.getGroup(user, id);
    const newGroupMessage = await new this.groupMessageModel({ groupId: group._id, userId: user._id, timestamp: new Date().getTime(), text }).save();
    return newGroupMessage;
  }

  async getGroupMessages(user: UserDocument, id: string, offset: number, limit: number) {
    const group = await this.groupService.getGroup(user, id);
    const messages = await this.groupMessageModel.find({ groupId: group._id }).sort({ timestamp: -1 }).skip(offset).limit(limit);
    return messages;
  }

}
