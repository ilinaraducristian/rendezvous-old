import {BaseQueryFn, createApi} from "@reduxjs/toolkit/dist/query/react";
import socket from "socketio";
import {Processedservers} from "types/Server";
import Message from "types/Message";

const socketioBaseQuery = (): BaseQueryFn<{
    ev: string
    data?: any
}, any, unknown> => ({ev, data}) => socket.emitAck(ev, data).then(data => ({data}));

export const socketioApi = createApi({
    reducerPath: "socketioApi",
    baseQuery: socketioBaseQuery(),
    endpoints: (builder) => ({
        getUserData: builder.query<Processedservers, void>({
            query: () => ({ev: "get_user_data"})
        }),
        joinServer: builder.query<Processedservers, string>({
            query: (invitation) => ({ev: "join_server", data: {invitation}})
        }),
        createServer: builder.query<Processedservers, string>({
            query: (name) => ({ev: "create_server", data: {name}}),
        }),
        createChannel: builder.query<any, { serverId: number, groupId: number | null, channelName: string }>({
            query: (data) => ({ev: "create_channel", data})
        }),
        createGroup: builder.query<any, { serverId: number, groupName: string }>({
            query: (data) => ({ev: "create_group", data})
        }),
        getMessages: builder.query<Message[], { [key: string]: number }>({
            query: (data) => ({ev: "get_messages", data}),
        }),
        createInvitation: builder.query<string, number>({
            query: (serverId) => ({ev: "create_invitation", data: {serverId}}),
            transformResponse: (response: { invitation: string }) => response.invitation
        }),
        editMessage: builder.query<string, { serverId: number, channelId: number, messageId: number, text: string }>({
            query: (data) => ({ev: "edit_message", data})
        }),
        deleteMessage: builder.query<string, { serverId: number, channelId: number, messageId: number }>({
            query: (data) => ({ev: "delete_message", data})
        }),
        sendFriendRequest: builder.query<{ id: number, userId: string }, { username: string }>({
            query: (data) => ({ev: "send_friend_request", data})
        }),
        acceptFriendRequest: builder.query<string, any>({
            query: (data) => ({ev: "accept_friend_request", data})
        }),
    }),
});

export const {
    useLazyGetUserDataQuery,
    useLazyJoinServerQuery,
    useLazyCreateServerQuery,
    useLazyCreateChannelQuery,
    useLazyCreateGroupQuery,
    useLazyGetMessagesQuery,
    useLazyCreateInvitationQuery,
    useLazyEditMessageQuery,
    useLazyDeleteMessageQuery,
    useLazySendFriendRequestQuery,
    useLazyAcceptFriendRequestQuery,
} = socketioApi;