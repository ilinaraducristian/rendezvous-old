import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { ChannelType } from "../dtos/channel";

@Schema()
class Channel {
  _id?: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: 0 })
  order: number;

  @Prop({ required: true })
  type: ChannelType;

  static toDTO(channel: ChannelDocument, serverId: string, groupId: string) {
    const dtoChannel: any = channel.toObject();
    delete dtoChannel._id;
    dtoChannel.id = channel._id.toString();
    dtoChannel.serverId = serverId;
    dtoChannel.groupId = groupId;
    return dtoChannel;
  }
}

export type ChannelDocument = Document<any, any, Channel> & Channel;
export const ChannelSchema = SchemaFactory.createForClass(Channel);
export default Channel;
