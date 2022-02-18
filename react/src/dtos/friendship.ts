import FriendshipStatus from "./friendship-status";

type Friendship = {
  id: string;
  user1Id: string;
  user2Id: string;
  status: FriendshipStatus;
};

export default Friendship;
