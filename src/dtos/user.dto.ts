import {servers} from "../types/Server";

export type UserDataResponse = servers;

export type AcceptFriendRequest = {
    friendRequestId: number
}

export type SendFriendRequest = {
    username: string
}

export type SendFriendRequestResponse = {
    id: number,
    userId: string
}