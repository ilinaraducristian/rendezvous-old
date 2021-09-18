import {BaseQueryFn, createApi} from "@reduxjs/toolkit/dist/query/react";
import socket from "socketio";
import {
    JoinVoiceChannelRequest,
    JoinVoiceChannelResponse,
    MoveChannelRequest,
    MoveChannelResponse,
    NewChannelRequest,
    NewChannelResponse
} from "../../dtos/channel.dto";
import {NewGroupRequest, NewGroupResponse} from "../../dtos/group.dto";
import {
    DeleteMessagesRequest,
    EditMessagesRequest,
    GetMessagesRequest,
    Message,
    NewMessageRequest
} from "../../dtos/message.dto";
import {
    JoinServerRequest,
    JoinServerResponse,
    NewInvitationRequest,
    NewServerRequest,
    NewServerResponse
} from "../../dtos/server.dto";
import {AcceptFriendRequest, SendFriendRequest, SendFriendRequestResponse, UserDataResponse} from "../../dtos/user.dto";

const socketioBaseQuery = (): BaseQueryFn<{
    ev: string
    data?: {
        [key: string]: any
    }
}, {
    [key: string]: any
}, Error> => ({ev, data}) => socket.emitAck(ev, data).then(data => ({data}));

export const socketioApi = createApi({
    reducerPath: "socketioApi",
    baseQuery: socketioBaseQuery(),
    endpoints: (builder) => ({
        joinVoiceChannel: builder.query<JoinVoiceChannelResponse, JoinVoiceChannelRequest>({
            query: (data) => ({ev: "join_voice_channel", data})
        }),
        createChannel: builder.query<NewChannelResponse, NewChannelRequest>({
            query: (data) => ({ev: "create_channel", data})
        }),
        moveChannel: builder.query<MoveChannelResponse, MoveChannelRequest>({
            query: (data) => ({ev: "move_channel", data})
        }),
        createGroup: builder.query<NewGroupResponse, NewGroupRequest>({
            query: (data) => ({ev: "create_group", data})
        }),
        sendMessage: builder.query<Message, NewMessageRequest>({
            query: (data) => ({ev: "send_message", data})
        }),
        getMessages: builder.query<Message[], GetMessagesRequest>({
            query: (data) => ({ev: "get_messages", data}),
        }),
        editMessage: builder.query<string, EditMessagesRequest>({
            query: (data) => ({ev: "edit_message", data})
        }),
        deleteMessage: builder.query<string, DeleteMessagesRequest>({
            query: (data) => ({ev: "delete_message", data})
        }),
        createServer: builder.query<NewServerResponse, NewServerRequest>({
            query: (data) => ({ev: "create_server", data}),
        }),
        createInvitation: builder.query<string, NewInvitationRequest>({
            query: (data) => ({ev: "create_invitation", data}),
            transformResponse: (response: { invitation: string }) => response.invitation
        }),
        joinServer: builder.query<JoinServerResponse, JoinServerRequest>({
            query: (data) => ({ev: "join_server", data})
        }),
        sendFriendRequest: builder.query<SendFriendRequestResponse, SendFriendRequest>({
            query: (data) => ({ev: "send_friend_request", data})
        }),
        getUserData: builder.query<UserDataResponse, void>({
            query: () => ({ev: "get_user_data"})
        }),
        acceptFriendRequest: builder.query<any, AcceptFriendRequest>({
            query: (data) => ({ev: "accept_friend_request", data})
        }),
        rejectFriendRequest: builder.query<any, any>({
            query: (data) => ({ev: "reject_friend_request", data})
        }),
        deleteServer: builder.query<void, { serverId: number }>({
            query: (data) => ({ev: "delete_server", data})
        }),
    }),
});

export const {
    useLazyGetUserDataQuery,
    useLazyJoinServerQuery,
    useLazyCreateServerQuery,
    useLazyCreateChannelQuery,
    useLazyCreateGroupQuery,
    useLazySendMessageQuery,
    useLazyGetMessagesQuery,
    useLazyCreateInvitationQuery,
    useLazyDeleteServerQuery,
    useLazyEditMessageQuery,
    useLazyDeleteMessageQuery,
    useLazySendFriendRequestQuery,
    useLazyAcceptFriendRequestQuery,
    useLazyRejectFriendRequestQuery,
    useLazyMoveChannelQuery,
    useLazyJoinVoiceChannelQuery
} = socketioApi;