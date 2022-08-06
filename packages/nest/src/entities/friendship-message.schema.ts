import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";

export type FriendshipMessageDocument = FriendshipMessage & mongoose.Document;

@Schema()
export class FriendshipMessage {

  @Prop({required: true, type: mongoose.Types.ObjectId, ref: 'Friendship'})
  friendshipId: string;

  @Prop({required: true})
  userId: string;

  @Prop({required: true})
  text: string;
}

export const FriendshipMessageSchema = SchemaFactory.createForClass(FriendshipMessage);
