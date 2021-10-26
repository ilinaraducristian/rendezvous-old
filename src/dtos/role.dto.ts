export type Role = {
    id: number,
    serverId: number,
    name: string,
    renameServer: boolean,
    createInvitation: boolean,
    deleteServer: boolean,
    createChannels: boolean,
    createGroups: boolean,
    deleteChannels: boolean,
    deleteGroups: boolean,
    moveChannels: boolean,
    moveGroups: boolean,
    readMessages: boolean,
    writeMessages: boolean
}