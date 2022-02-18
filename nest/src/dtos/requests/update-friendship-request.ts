import { IsEnum } from "class-validator";
import FriendshipStatus from "../friendship-status";

class UpdateFriendshipRequest {
  @IsEnum(FriendshipStatus)
  status: FriendshipStatus;
}

export default UpdateFriendshipRequest;
