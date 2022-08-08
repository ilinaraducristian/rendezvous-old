import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type FriendshipMessageDocument = FriendshipMessage & Document;

@Schema()
export class FriendshipMessage {
  @Prop({required: true, type: Types.ObjectId, ref: 'Friendship'})
  friendshipId: string;

  @Prop({required: true, type: Types.ObjectId, ref: 'User'})
  userId: string;

  @Prop({required: true})
  timestamp: Date;

  @Prop({required: true})
  text: string;
}

export const FriendshipMessageSchema = SchemaFactory.createForClass(FriendshipMessage);
