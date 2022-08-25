import { Types } from "mongoose";

export default class Reaction {
  _id: Types.ObjectId = new Types.ObjectId();
  userId: Types.ObjectId;
  text: string;

  constructor(userId: Types.ObjectId, text: string) {
    this.userId = userId;
    this.text = text;
  }

}
