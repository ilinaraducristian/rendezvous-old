import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import Message from "./message.schema";

export type GroupMessageDocument = GroupMessage & Document;

@Schema()
export class GroupMessage extends Message{
  @Prop({ required: true, type: Types.ObjectId, ref: 'Group' })
  groupId: Types.ObjectId;

  @Prop({ default: null, type: Types.ObjectId, ref: 'GroupMessage' })
  replyId: Types.ObjectId | null;
}

export const GroupMessageSchema = SchemaFactory.createForClass(GroupMessage);
