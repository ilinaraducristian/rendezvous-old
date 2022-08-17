import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { ServerGroupDocument } from "./server-group.schema";
import { UserDocument } from "./user.schema";

export type ServerDocument = Server & Document;

@Schema()
export class Server {
  @Prop({ required: true })
  name: string;

  @Prop({default: null})
  invitation: string | null;

  @Prop({ default: [] })
  groups: ServerGroupDocument[];

  @Prop({ default: [], type: [{type: Types.ObjectId, ref: 'User'}] })
  members: UserDocument[];

}

export const ServerSchema = SchemaFactory.createForClass(Server);
