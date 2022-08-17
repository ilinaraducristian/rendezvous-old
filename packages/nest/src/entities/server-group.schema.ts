import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { ChannelDocument } from "./channel.schema";

export type ServerGroupDocument = ServerGroup & Document;

@Schema()
export class ServerGroup {
  @Prop({ required: true })
  name: string;

  @Prop({ default: [] })
  channels: ChannelDocument[];

}

export const ServerGroupSchema = SchemaFactory.createForClass(ServerGroup);
