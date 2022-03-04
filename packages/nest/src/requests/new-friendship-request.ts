import { IsUUID } from "class-validator";

class NewFriendshipRequest {
  @IsUUID()
  userId: string;
}

export default NewFriendshipRequest;
