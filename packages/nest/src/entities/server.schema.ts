import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { ServerGroup } from "./server-group.schema";
import { UserDocument } from "./user.schema";

export type ServerDocument = Server & Document;

@Schema()
export class Server {
  @Prop({ required: true })
  name: string;

  @Prop({default: null})
  invitation: string | null;

  @Prop({ default: [], type: ServerGroup })
  groups: ServerGroup[];

  @Prop({ default: [], type: [{type: Types.ObjectId, ref: 'User'}] })
  members: UserDocument[];

}

export const ServerSchema = SchemaFactory.createForClass(Server);
