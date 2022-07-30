import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import { Friendship, FriendshipDocument } from "./friendship.schema";
import { Group } from "./group.schema";

export type UserDocument = User & mongoose.Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: [], type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Friendship'}] })
  friendships: (Friendship | FriendshipDocument)[];

  @Prop({ default: [], type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Group'}] })
  groups: Group[];
}

export const UserSchema = SchemaFactory.createForClass(User);
