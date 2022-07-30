import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type GroupMessageDocument = GroupMessage & Document;

@Schema()
export class GroupMessage {

  @Prop({required: true})
  userId: string;

  @Prop({required: true})
  text: string;
}

export const GroupMessageSchema = SchemaFactory.createForClass(GroupMessage);
