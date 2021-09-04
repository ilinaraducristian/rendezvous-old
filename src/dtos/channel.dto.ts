export type JoinVoiceChannelRequest = {
    serverId: number,
    channelId: number,
}

export type JoinVoiceChannelResponse = {
    channelId: number,
    socketId: string,
    userId: string
}[]

export type NewChannelRequest = {
    serverId: number,
    groupId: number | null,
    channelName: string
}

export type NewChannelResponse = {
    channelId: number
}

export type MoveChannelRequest = {
    serverId: number,
    channelId: number,
    groupId: number | null,
    order: number
}
