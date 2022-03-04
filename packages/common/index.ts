export type ReactionDto = {
  id: string,
  userId: string,
  serverEmoji?: boolean,
  emoji: string
};

export type MessageDto = {
  id: string;
  userId: string;
  text: string;
  timestamp: Date;
  files: string[];
  reactions: ReactionDto[];
};

export type ChannelMessageDto = MessageDto & {
  serverId: string;
  groupId: string;
  channelId: string;
};

export type FriendshipMessageDto = MessageDto & {
  friendshipId: string;
};

export type MemberDto = {
  id: string;
  serverId: string;
  userId: string;
};

export type InvitationDto = {
  link: string;
  exp: Date;
};

export type EmojiDto = {
  id: string;
  alias: string;
  md5: string;
};

export type CommonIds = {
  serverId: string;
  memberId: string;
  groupId: string;
  channelId: string;
  messageId: string;
  reactionId: string;
  friendshipId: string;
};

export type MemberIds = Pick<CommonIds, "serverId" | "memberId">;
export type GroupIds = Pick<CommonIds, "serverId" | "groupId">;
export type ChannelIds = GroupIds & Pick<CommonIds, "channelId">;
export type ChannelMessageIds = ChannelIds & Pick<CommonIds, "messageId">;
export type ChannelMessageReactionIds = ChannelMessageIds &
  Pick<CommonIds, "reactionId">;
export type FriendshipMessageIds = Pick<
  CommonIds,
  "friendshipId" | "messageId"
>;
export type FriendshipMessageReactionIds = FriendshipMessageIds &
  Pick<CommonIds, "reactionId">;

export type ChannelDto = {
  id: string;
  serverId: string;
  groupId: string;
  name: string;
  order: number;
  type: ChannelTypeDto;
  users?: string[]
};

export enum ChannelTypeDto {
  text,
  voice,
}

export type FriendDto = {
  id: number;
  userId: string;
  messages: MessageDto[];
};

export type FriendshipDto = {
  id: string;
  user1Id: string;
  user2Id: string;
  status: FriendshipStatusDto;
};

export enum FriendshipStatusDto {
  pending,
  accepted,
  rejected,
}

export type ServerDto = {
  id: string;
  name: string;
  invitation: InvitationDto | null;
  order: number;
  groups: GroupDto[];
  members: MemberDto[];
  emojis: string[];
};

export type GroupDto = {
  id: string;
  serverId: string;
  name: string;
  order: number;
  channels: ChannelDto[];
};

export type MovedServers = Pick<ServerDto, "id" | "order">[];

export enum SocketIoServerEvents {
  newMember = "new-member",
  memberLeft = "member-left",

  serverUpdate = "server-update",
  serverDeleted = "server-deleted",

  newGroup = "new-group",
  groupUpdate = "group-update",
  groupDeleted = "group-deleted",
  newChannel = "new-channel",

  newVoiceChannelUser = "new-voice-channel-user",

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

export type UserDto = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type UserDataResponse = {
  servers: ServerDto[];
  friendships: FriendshipDto[];
  users: UserDto[];
};
