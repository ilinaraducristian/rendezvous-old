import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { ServerGroup } from "./server-group.schema";
import { v4 as uuid } from 'uuid';

export type ServerDocument = Server & Document;

@Schema()
export class Server {
  @Prop({ required: true })
  name: string;

  @Prop({ default: uuid() })
  invitation: string;

  @Prop({ default: [], type: ServerGroup })
  groups: ServerGroup[];

  @Prop({ default: [], type: [{ type: Types.ObjectId, ref: 'User' }] })
  members: Types.ObjectId[];

}

export const ServerSchema = SchemaFactory.createForClass(Server);
