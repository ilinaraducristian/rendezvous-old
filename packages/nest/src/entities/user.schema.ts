import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, Document } from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: [], type: [{ type: Types.ObjectId, ref: "Friendship" }] })
  friendships: Types.ObjectId[];

  @Prop({ default: [], type: [{ type: Types.ObjectId, ref: "Group" }] })
  groups: Types.ObjectId[];

  @Prop({ default: [], type: [{ type: Types.ObjectId, ref: "Server" }] })
  servers: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
