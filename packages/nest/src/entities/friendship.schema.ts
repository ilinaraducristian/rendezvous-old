import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { FriendshipStatus } from "../friendship/friendship.dto";

export type FriendshipDocument = Friendship & Document;

@Schema()
export class Friendship {
  @Prop({ required: true, type: Types.ObjectId, ref: "User" })
  user1: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: "User" })
  user2: Types.ObjectId;

  @Prop({ default: FriendshipStatus.pending })
  status: FriendshipStatus;
}

export const FriendshipSchema = SchemaFactory.createForClass(Friendship);
