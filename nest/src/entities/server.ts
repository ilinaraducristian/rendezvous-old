import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import Invitation from "../dtos/invitation";
import ServerDTO from "../dtos/server";
import Emoji, { EmojiDocument } from "../entities/emoji";
import Group, { GroupDocument, GroupSchema } from "./group";
import Member from "./member";

@Schema()
class Server {
  @Prop({ required: true })
  name: string;

  @Prop({ default: null, type: Object })
  invitation: Invitation | null;

  @Prop({ default: [], type: [GroupSchema] })
  groups: Group[];

  @Prop({ default: [], type: [{ type: Types.ObjectId, ref: "Member" }] })
  members: Member[];

  @Prop({ default: [] })
  emojis: Emoji[];

  static toDTO(server: ServerDocument): ServerDTO {
    const dtoServer: any = server.toObject();
    delete dtoServer._id;
    delete dtoServer.__v;
    dtoServer.id = server._id.toString();
    dtoServer.groups = server.groups.map((group: GroupDocument) => Group.toDTO(group, dtoServer.id));
    dtoServer.members = server.members.map((member) => Member.toDTO(member));
    dtoServer.emojis = server.emojis.map((emoji: EmojiDocument) => Emoji.toDTO(emoji));
    return dtoServer;
  }
}

export type ServerDocument = Document<any, any, Server> & Server;
export const ServerSchema = SchemaFactory.createForClass(Server);
export default Server;
