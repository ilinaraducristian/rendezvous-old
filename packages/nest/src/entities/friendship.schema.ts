import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { UserDocument } from "./user.schema";

export type FriendshipDocument = Friendship & Document;

@Schema()
export class Friendship {
  @Prop({ required: true, type: Types.ObjectId, ref: "User" })
  user1: UserDocument;

  @Prop({ required: true, type: Types.ObjectId, ref: "User" })
  user2: UserDocument;

  @Prop({ default: 'pending' })
  status: string;
}

export const FriendshipSchema = SchemaFactory.createForClass(Friendship);
