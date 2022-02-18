enum SocketIoServerEvents {
  newMember = "new-member",
  memberLeft = "member-left",

  serverUpdate = "server-update",
  serverDeleted = "server-deleted",

  newGroup = "new-group",
  groupUpdate = "group-update",
  groupDeleted = "group-deleted",
  newChannel = "new-channel",

  channelUpdate = "channel-update",
  channelDeleted = "channel-deleted",

  newChannelMessage = "new-channel-message",
  channelMessageDeleted = "channel-message-deleted",

  newChannelMessageReaction = "new-channel-message-reaction",
  channelMessageReactionDeleted = "channel-message-reaction-deleted",

  newFriendshipMessage = "new-friendship-message",
  friendshipMessageDeleted = "friendship-message-deleted",

  newFriendshipMessageReaction = "new-friendship-message-reaction",
  friendshipMessageReactionDeleted = "friendship-message-reaction-deleted",

  userOnline = "user-online",
  userOffline = "user-offline",

  newFriendship = "new-friendship",
  friendshipUpdate = "friendship-update",
  friendshipDeleted = "friendship-deleted",
}

export default SocketIoServerEvents;
