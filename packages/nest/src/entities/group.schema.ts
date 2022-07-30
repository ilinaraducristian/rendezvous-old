import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { User } from "./user.schema";

export type GroupDocument = Group & mongoose.Document;

@Schema()
export class Group {
  @Prop({ required: true })
  name: string;

  @Prop({ default: [], type: [{type: mongoose.Types.ObjectId, ref: 'User'}] })
  members: User[];

}

export const GroupSchema = SchemaFactory.createForClass(Group);
