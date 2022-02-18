import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { AnyKeys, AnyObject, Model } from "mongoose";
import { ServerDocument } from "src/entities/server";
import Member, { MemberDocument } from "../entities/member";

@Injectable()
export class UsersService {
  constructor(@InjectModel(Member.name) private readonly memberModel: Model<Member>) {}

  newMember(member: AnyKeys<Member> & AnyObject) {
    return new this.memberModel(member);
  }

  deleteMember(userId: string, serverId: string) {
    return this.memberModel.findOneAndDelete({ userId, serverId });
  }

  async haveServersInCommon(user1Id: string, user2Id: string) {
    const [user1Servers, user2Servers] = await Promise.all([this.memberModel.find({ userId: user1Id }), this.memberModel.find({ userId: user2Id })]);
    for (const server1 of user1Servers) {
      if (user2Servers.find((server2) => server1._id === server2._id)) return true;
    }
    return false;
  }

  async getServers(userId: string) {
    return (
      (await this.memberModel.find({ userId }).populate({
        path: "serverId",
        populate: "members",
      })) as (Member & { serverId: ServerDocument })[]
    ).map((member) => member.serverId as ServerDocument);
  }

  getMembers(serverId: string) {
    return this.memberModel.find({ serverId });
  }

  deleteServerMembers(serverId: string): any {
    return this.memberModel.deleteMany({ serverId });
  }

  getUserLastServer(userId: string) {
    return this.memberModel.find({ userId }).sort({ order: -1 }).limit(1);
  }

  getUserSortedServers(userId: string) {
    return this.memberModel.find({ userId }).sort({ order: 1 });
  }

  saveMembers(members: MemberDocument[]): Promise<any> {
    return this.memberModel.bulkSave(members);
  }

  async isMember(userId: string, serverId: string) {
    try {
      return await this.memberModel.exists({ userId, serverId });
    } catch (e) {
      return false;
    }
  }
}
