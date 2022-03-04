import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { MemberDto } from "@rendezvous/common";
import * as mongoose from "mongoose";
import { Document } from "mongoose";

@Schema()
class Member {
  _id?: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Server" })
  serverId: string;

  @Prop({ default: 0 })
  order: number;

  static toDTO(member: Member & { id?: string }): MemberDto {
    return {
      id: member.id.toString(),
      userId: member.userId,
      serverId: member.serverId.toString(),
    };
  }
}

export type MemberDocument = Document<any, any, Member> & Member;
export const MemberSchema = SchemaFactory.createForClass(Member);
export default Member;
