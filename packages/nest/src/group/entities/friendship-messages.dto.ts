type FriendshipMessagesDto = {
  messages: {
    id: string,
    friendshipId: string,
    userId: string,
    timestamp: string,
    text: string
  }[]
};

export default FriendshipMessagesDto;