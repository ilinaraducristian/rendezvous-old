import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import Message from "./message.schema";

export type FriendshipMessageDocument = FriendshipMessage & Document;

@Schema()
export class FriendshipMessage extends Message {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Friendship' })
  friendshipId: Types.ObjectId;
}

export const FriendshipMessageSchema = SchemaFactory.createForClass(FriendshipMessage);
