import { Prop } from "@nestjs/mongoose";
import { Types } from "mongoose";
import Reaction from "./reaction.schema";

export default class Message {

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  timestamp: number;

  @Prop({ required: true })
  text: string;

  replyId: Types.ObjectId | null;

  @Prop({ default: [] })
  reactions: Reaction[];

}
