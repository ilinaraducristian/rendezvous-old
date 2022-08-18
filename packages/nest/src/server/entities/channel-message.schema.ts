import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ChannelMessageDocument = ChannelMessage & Document;

@Schema()
export class ChannelMessage {

  @Prop({required: true, type: Types.ObjectId, ref: 'Channel'})
  channelId: string;

  @Prop({required: true, type: Types.ObjectId, ref: 'User'})
  userId: string;

  @Prop({required: true})
  timestamp: Date;

  @Prop({required: true})
  text: string;
}

export const ChannelMessageSchema = SchemaFactory.createForClass(ChannelMessage);
