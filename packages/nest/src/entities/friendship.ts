import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { FriendshipDto, FriendshipStatusDto } from "@rendezvous/common";
import { Document } from "mongoose";

@Schema()
class Friendship {
  _id?: string;

  @Prop({ required: true })
  user1Id: string;

  @Prop({ required: true })
  user2Id: string;

  @Prop({ default: FriendshipStatusDto.pending })
  status: FriendshipStatusDto;

  static toDTO(friendship: FriendshipDocument): FriendshipDto {
    const dtoFriendship: any = friendship.toObject();
    delete dtoFriendship._id;
    dtoFriendship.id = friendship._id.toString();
    return dtoFriendship;
  }
}

export type FriendshipDocument = Document<any, any, Friendship> & Friendship;
export const FriendshipSchema = SchemaFactory.createForClass(Friendship);
export default Friendship;
