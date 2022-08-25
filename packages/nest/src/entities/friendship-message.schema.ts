import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { FriendshipDocument } from "./friendship.schema";
import Message from "./message.schema";

export type FriendshipMessageDocument = FriendshipMessage & Document;

@Schema()
export class FriendshipMessage extends Message {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Friendship' })
  friendshipId: Types.ObjectId;

  @Prop({ default: null, type: Types.ObjectId, ref: 'FriendshipMessage' })
  replyId: Types.ObjectId | null;

  friendship?: FriendshipDocument;
}

export const FriendshipMessageSchema = SchemaFactory.createForClass(FriendshipMessage);
