import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import Reaction, { ReactionDocument } from "./reaction";
import { Document, Types } from "mongoose";

@Schema()
class Message {
  _id?: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ default: [] })
  files: string[];

  @Prop({ default: [] })
  reactions: Reaction[];
}

@Schema()
export class FriendshipMessage extends Message {
  @Prop({ type: Types.ObjectId, ref: "Friendship" })
  friendshipId: string;

  static toDTO(message: FriendshipMessageDocument) {
    const dtoMessage: any = message.toObject();
    delete dtoMessage._id;
    dtoMessage.id = message._id.toString();
    return dtoMessage;
  }
}

export type FriendshipMessageDocument = Document<any, any, FriendshipMessage> & FriendshipMessage;
export const FriendshipMessageSchema = SchemaFactory.createForClass(FriendshipMessage);

@Schema()
export class ChannelMessage extends Message {
  @Prop({ required: true })
  channelId: string;

  static toDTO(message: ChannelMessageDocument, serverId: string, groupId: string) {
    const dtoMessage: any = message.toObject();
    delete dtoMessage._id;
    dtoMessage.id = message._id.toString();
    dtoMessage.serverId = serverId;
    dtoMessage.groupId = groupId;
    dtoMessage.reactions = message.reactions.map((reaction: ReactionDocument) => Reaction.toDTO(reaction));
    return dtoMessage;
  }
}

export type ChannelMessageDocument = Document<any, any, ChannelMessage> & ChannelMessage;
export const ChannelMessageSchema = SchemaFactory.createForClass(ChannelMessage);

export default Message;
