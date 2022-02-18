import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import ReactionDTO from "../dtos/reaction";

@Schema()
class Reaction {
  _id?: string;

  @Prop({ required: true })
  userId: string;

  @Prop()
  serverEmoji?: boolean;

  @Prop({ required: true })
  emoji: string;

  static toDTO(reaction: ReactionDocument): ReactionDTO {
    const dtoReaction: any = reaction.toObject();
    delete dtoReaction._id;
    dtoReaction.id = reaction._id.toString();
    return dtoReaction;
  }
}

export type ReactionDocument = Document<any, any, Reaction> & Reaction;
export const ReactionSchema = SchemaFactory.createForClass(Reaction);
export default Reaction;
