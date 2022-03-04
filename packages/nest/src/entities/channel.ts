import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ChannelTypeDto } from "@rendezvous/common";
import { Document } from "mongoose";

@Schema()
class Channel {
  _id?: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: 0 })
  order: number;

  @Prop({ required: true })
  type: ChannelTypeDto;

  users?: string[];

  static toDTO(channel: ChannelDocument, serverId: string, groupId: string) {
    const dtoChannel: any = channel.toObject();
    delete dtoChannel._id;
    dtoChannel.id = channel._id.toString();
    dtoChannel.serverId = serverId;
    dtoChannel.groupId = groupId;
    dtoChannel.users = channel.users;
    return dtoChannel;
  }
}

export type ChannelDocument = Document<any, any, Channel> & Channel;
export const ChannelSchema = SchemaFactory.createForClass(Channel);
export default Channel;
