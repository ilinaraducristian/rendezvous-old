import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { User } from "./user.schema";

export type FriendshipDocument = Friendship & mongoose.Document;

@Schema()
export class Friendship {
  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: "User" })
  user1: User;

  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: "User" })
  user2: User;
}

export const FriendshipSchema = SchemaFactory.createForClass(Friendship);
