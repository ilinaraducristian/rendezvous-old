import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type GroupMessageDocument = GroupMessage & Document;

@Schema()
export class GroupMessage {

  @Prop({required: true, type: Types.ObjectId, ref: 'Group'})
  groupId: string;

  @Prop({required: true})
  userId: string;

  @Prop({required: true})
  timestamp: Date;

  @Prop({required: true})
  text: string;
}

export const GroupMessageSchema = SchemaFactory.createForClass(GroupMessage);
