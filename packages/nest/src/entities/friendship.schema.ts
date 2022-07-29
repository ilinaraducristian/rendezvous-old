import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type FriendshipDocument = Friendship & Document;

@Schema()
export class Friendship {
  @Prop({required: true})
  user1Id: string;

  @Prop({required: true})
  user2Id: string;
}

export const FriendshipSchema = SchemaFactory.createForClass(Friendship);
