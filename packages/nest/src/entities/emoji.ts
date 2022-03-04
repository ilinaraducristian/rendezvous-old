import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
class Emoji {
  _id?: string;

  @Prop({ required: true })
  alias: string;

  @Prop({ required: true })
  md5: string;

  static toDTO(emoji: EmojiDocument) {
    const dtoEmoji: any = emoji.toObject();
    delete dtoEmoji._id;
    dtoEmoji.id = emoji._id.toString();
    return dtoEmoji;
  }
}

export type EmojiDocument = Document<any, any, Emoji> & Emoji;
export const EmojiSchema = SchemaFactory.createForClass(Emoji);
export default Emoji;
