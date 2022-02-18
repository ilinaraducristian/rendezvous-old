import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import FriendshipDTO from "../dtos/friendship";
import FriendshipStatus from "../dtos/friendship-status";

@Schema()
class Friendship {
  _id?: string;

  @Prop({ required: true })
  user1Id: string;

  @Prop({ required: true })
  user2Id: string;

  @Prop({ default: FriendshipStatus.pending })
  status: FriendshipStatus;

  static toDTO(friendship: FriendshipDocument): FriendshipDTO {
    const dtoFriendship: any = friendship.toObject();
    delete dtoFriendship._id;
    dtoFriendship.id = friendship._id.toString();
    return dtoFriendship;
  }
}

export type FriendshipDocument = Document<any, any, Friendship> & Friendship;
export const FriendshipSchema = SchemaFactory.createForClass(Friendship);
export default Friendship;
