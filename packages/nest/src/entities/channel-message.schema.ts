import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import Message from "./message.schema";

export type ChannelMessageDocument = ChannelMessage & Document;

@Schema()
export class ChannelMessage extends Message {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Channel' })
  channelId: Types.ObjectId;
}
export const ChannelMessageSchema = SchemaFactory.createForClass(ChannelMessage);
