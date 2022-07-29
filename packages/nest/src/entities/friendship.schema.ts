import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Message, MessageDocument } from './message.schema';

export type FriendshipDocument = Friendship & Document;

@Schema()
export class Friendship {
  @Prop({required: true})
  user1Id: string;

  @Prop({required: true})
  user2Id: string;

  @Prop({ default: [], type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}] })
  messages: (Message | MessageDocument)[];
}

export const FriendshipSchema = SchemaFactory.createForClass(Friendship);
