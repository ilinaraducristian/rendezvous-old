type CommonIds = {
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
export type ChannelMessageReactionIds = ChannelMessageIds & Pick<CommonIds, "reactionId">;
export type FriendshipMessageIds = Pick<CommonIds, "friendshipId" | "messageId">;
export type FriendshipMessageReactionIds = FriendshipMessageIds & Pick<CommonIds, "reactionId">;

export default CommonIds;
