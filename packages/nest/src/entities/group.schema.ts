import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type GroupDocument = Group & Document;

@Schema()
export class Group {
  @Prop({ required: true })
  name: string;

  @Prop({ default: [], type: [{type: Types.ObjectId, ref: 'User'}] })
  members: Types.ObjectId[];

}

export const GroupSchema = SchemaFactory.createForClass(Group);
