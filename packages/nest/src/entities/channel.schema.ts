import { Types } from "mongoose";

export class Channel {

  _id: Types.ObjectId;
  name: string;

  constructor(name: string) {
    this.name = name;
  }

}