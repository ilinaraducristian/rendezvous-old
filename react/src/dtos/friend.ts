import { FriendshipMessageDto } from "./message";

type Friend = {
  id: number;
  userId: string;
  messages: FriendshipMessageDto[];
};

export default Friend;
