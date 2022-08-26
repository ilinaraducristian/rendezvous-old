import { Types } from "mongoose";
import { Channel } from "./channel.schema";

export class ServerGroup {
  _id: Types.ObjectId = new Types.ObjectId();
  name: string = null;
  channels: Channel[] = [];

  constructor(name?: string) {
    this.name = name;
  }
}
