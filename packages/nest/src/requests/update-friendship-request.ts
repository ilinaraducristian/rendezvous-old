import { FriendshipStatusDto } from "@rendezvous/common";
import { IsEnum } from "class-validator";

class UpdateFriendshipRequest {
  @IsEnum(FriendshipStatusDto)
  status: FriendshipStatusDto;
}

export default UpdateFriendshipRequest;
